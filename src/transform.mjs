/**
 * Matra Core - Transform Module
 * Template evaluation: m-if, m-else, m-each, {{mustache}}
 */

/**
 * Get value from context by dot-separated path
 * @param {Record<string, any>[]} scopes
 * @param {string} path
 * @returns {any}
 */
function getByPath(scopes, path) {
  const parts = path.split('.').map(s => s.trim()).filter(Boolean)
  if (!parts.length) return undefined

  // Search from most recent scope (last to first)
  for (let si = scopes.length - 1; si >= 0; si--) {
    let cur = scopes[si]
    let ok = true
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p]
      } else if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p]
      } else {
        ok = false
        break
      }
    }
    if (ok) return cur
  }
  return undefined
}

/**
 * Interpolate {{mustache}} variables in string
 * @param {Record<string, any>[]} scopes
 * @param {string} str
 * @returns {string}
 */
function interpolateString(scopes, str) {
  const MUSTACHE_RE = /\{\{\s*([^}]+?)\s*\}\}/g
  return str.replace(MUSTACHE_RE, (_, expr) => {
    const v = getByPath(scopes, String(expr))
    if (v === null || v === undefined) return ''
    if (typeof v === 'string') return v
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    return ''
  })
}

/**
 * Clone node deeply
 * @param {any} node
 * @returns {any}
 */
function cloneNode(node) {
  return JSON.parse(JSON.stringify(node))
}

/**
 * Find next element sibling (skip whitespace-only text nodes)
 * @param {any[]} list
 * @param {number} idx
 * @returns {{ el: any, index: number } | null}
 */
function nextElementSibling(list, idx) {
  for (let j = idx + 1; j < list.length; j++) {
    const n = list[j]
    if (n?.type === 'text') {
      const v = n.value
      if (typeof v === 'string' && v.trim() === '') continue
      return null // non-empty text, not an else
    }
    if (n?.type === 'element') return { el: n, index: j }
    return null
  }
  return null
}

/**
 * Transform node list with template directives
 * @param {any[]} nodeList
 * @param {Record<string, any>[]} scopes
 * @returns {any[]}
 */
function transformWithScopes(nodeList, scopes) {
  const out = []

  for (let i = 0; i < nodeList.length; i++) {
    const n = nodeList[i]

    // Text node: interpolate variables
    if (n?.type === 'text') {
      out.push({
        type: 'text',
        value: interpolateString(scopes, n.value)
      })
      continue
    }

    // Element node
    if (n?.type === 'element') {
      const el = n
      const tag = el.tagName
      const props = el.properties || {}

      // Handle m-if attribute
      if (props['m-if']) {
        const testPath = String(props['m-if'])
        const truthy = !!getByPath(scopes, testPath)
        const nextInfo = nextElementSibling(nodeList, i)

        if (truthy) {
          // Remove m-if and process normally
          const cloned = cloneNode(el)
          if (cloned.properties) delete cloned.properties['m-if']
          out.push(...transformWithScopes([cloned], scopes))

          // Skip next if it's m-else
          if (nextInfo) {
            const nextProps = nextInfo.el.properties || {}
            if (nextInfo.el.tagName === 'm-else' || nextProps['m-else']) {
              i = nextInfo.index
            }
          }
        } else {
          // falsy: process m-else if present
          if (nextInfo) {
            const nextEl = nextInfo.el
            const nextProps = nextEl.properties || {}
            if (nextEl.tagName === 'm-else' || nextProps['m-else']) {
              const clonedElse = cloneNode(nextEl)
              if (clonedElse.properties) delete clonedElse.properties['m-else']
              out.push(...transformWithScopes([clonedElse], scopes))
              i = nextInfo.index
            }
          }
        }
        continue
      }

      // Handle m-each attribute
      const eachKey = props['m-each'] || props['m-of']
      if (eachKey) {
        const ofPath = String(eachKey)
        const asName = String(props['m-as'] || 'item')
        const indexName = String(props['m-index'] || 'index')
        const items = getByPath(scopes, ofPath)

        if (Array.isArray(items)) {
          for (let idx = 0; idx < items.length; idx++) {
            const item = items[idx]
            const frame = { [asName]: item, index: idx }
            if (indexName !== 'index') frame[indexName] = idx

            // Clone base element without control attributes
            const baseEl = cloneNode(el)
            if (baseEl.properties) {
              delete baseEl.properties['m-each']
              delete baseEl.properties['m-of']
              delete baseEl.properties['m-as']
              delete baseEl.properties['m-index']
            }

            // Build instance with interpolated properties
            const inst = {
              type: 'element',
              tagName: baseEl.tagName,
              properties: {},
              children: []
            }

            if (baseEl.properties) {
              const newProps = {}
              for (const [k, v] of Object.entries(baseEl.properties)) {
                if (typeof v === 'string') {
                  newProps[k] = interpolateString([...scopes, frame], v)
                } else if (Array.isArray(v)) {
                  newProps[k] = v.map(x =>
                    typeof x === 'string' ? interpolateString([...scopes, frame], x) : x
                  )
                } else {
                  newProps[k] = v
                }
              }
              inst.properties = newProps
            }

            inst.children = transformWithScopes(
              (baseEl.children || []).map(cloneNode),
              [...scopes, frame]
            )
            out.push(inst)
          }
        }
        continue
      }

      // Handle m-if tag
      if (tag === 'm-if') {
        const testPath = String(props.test || '')
        const truthy = !!getByPath(scopes, testPath)
        const nextInfo = nextElementSibling(nodeList, i)

        if (truthy) {
          out.push(...transformWithScopes(el.children || [], scopes))
          if (nextInfo && nextInfo.el.tagName === 'm-else') {
            i = nextInfo.index
          }
        } else {
          if (nextInfo && nextInfo.el.tagName === 'm-else') {
            out.push(...transformWithScopes(nextInfo.el.children || [], scopes))
            i = nextInfo.index
          }
        }
        continue
      }

      // Handle m-else tag (skip if not consumed by m-if)
      if (tag === 'm-else') {
        continue
      }

      // Handle m-each tag
      if (tag === 'm-each') {
        const ofPath = String(props.of || '')
        const asName = String(props.as || 'item')
        const items = getByPath(scopes, ofPath)

        if (Array.isArray(items)) {
          for (let idx = 0; idx < items.length; idx++) {
            const item = items[idx]
            const frame = { [asName]: item, index: idx }
            out.push(...transformWithScopes((el.children || []).map(cloneNode), [...scopes, frame]))
          }
        }
        continue
      }

      // Normal element: interpolate properties and recurse
      const nextEl = {
        type: 'element',
        tagName: tag,
        properties: {},
        children: []
      }

      if (el.properties) {
        const newProps = {}
        for (const [k, v] of Object.entries(el.properties)) {
          if (typeof v === 'string') {
            newProps[k] = interpolateString(scopes, v)
          } else if (Array.isArray(v)) {
            newProps[k] = v.map(x =>
              typeof x === 'string' ? interpolateString(scopes, x) : x
            )
          } else {
            newProps[k] = v
          }
        }
        nextEl.properties = newProps
      }

      nextEl.children = transformWithScopes(el.children || [], scopes)
      out.push(nextEl)
      continue
    }

    // Other node types: pass through
    out.push(n)
  }

  return out
}

/**
 * Transform Matra AST with template context
 * @param {import('./types.mjs').MatraNode} ast
 * @param {Record<string, any>} context
 * @returns {import('./types.mjs').MatraNode}
 */
export function transform(ast, context = {}) {
  const scopes = [context]

  if (ast.type === 'root') {
    return {
      type: 'root',
      children: transformWithScopes(ast.children || [], scopes)
    }
  }

  // Single element or other node
  const result = transformWithScopes([ast], scopes)
  return result[0] || ast
}

export default { transform }
