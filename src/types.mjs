/**
 * Matra Core Types
 * Unified type system for Matra language and Matradown
 */

// ============================================================================
// Matra AST (Basic syntax tree from parser)
// ============================================================================

/**
 * @typedef {Object} MatraElement
 * @property {'element'} type
 * @property {string} tagName
 * @property {Record<string, any>} [properties]
 * @property {MatraNode[]} [children]
 */

/**
 * @typedef {Object} MatraText
 * @property {'text'} type
 * @property {string} value
 */

/**
 * @typedef {Object} MatraComment
 * @property {'comment'} type
 * @property {string} value
 */

/**
 * @typedef {Object} MatraRoot
 * @property {'root'} type
 * @property {MatraNode[]} children
 */

/**
 * @typedef {MatraElement | MatraText | MatraComment | MatraRoot} MatraNode
 */

// ============================================================================
// Matradown AST (Enhanced Markdown + Matra features)
// ============================================================================

/**
 * @typedef {Object} Position
 * @property {{ line: number, column: number, offset?: number }} start
 * @property {{ line: number, column: number, offset?: number }} end
 */

/**
 * @typedef {Object} MdBaseNode
 * @property {string} type
 * @property {Position} [position]
 * @property {Record<string, any>} [data]
 */

/**
 * @typedef {MdBaseNode & { type: 'text', value: string }} TextNode
 */

/**
 * @typedef {MdBaseNode & { type: 'paragraph', children: MdNode[] }} ParagraphNode
 */

/**
 * @typedef {MdBaseNode & { type: 'heading', depth: number, children: MdNode[] }} HeadingNode
 */

/**
 * @typedef {MdBaseNode & { type: 'emphasis', children: MdNode[] }} EmphasisNode
 */

/**
 * @typedef {MdBaseNode & { type: 'strong', children: MdNode[] }} StrongNode
 */

/**
 * @typedef {MdBaseNode & { type: 'link', url: string, title?: string, children: MdNode[] }} LinkNode
 */

/**
 * @typedef {MdBaseNode & { type: 'image', url: string, title?: string, alt?: string }} ImageNode
 */

/**
 * @typedef {MdBaseNode & { type: 'list', ordered?: boolean, start?: number, children: ListItemNode[] }} ListNode
 */

/**
 * @typedef {MdBaseNode & { type: 'listItem', checked?: boolean, children: MdNode[] }} ListItemNode
 */

/**
 * @typedef {MdBaseNode & { type: 'code', lang?: string, meta?: string, value: string }} CodeNode
 */

/**
 * @typedef {MdBaseNode & { type: 'inlineCode', value: string }} InlineCodeNode
 */

/**
 * @typedef {MdBaseNode & { type: 'blockquote', children: MdNode[] }} BlockquoteNode
 */

/**
 * @typedef {MdBaseNode & { type: 'inlineMath', value: string }} InlineMathNode
 */

/**
 * @typedef {MdBaseNode & { type: 'math', value: string }} MathNode
 */

/**
 * @typedef {MdBaseNode & { type: 'table', children: TableRowNode[] }} TableNode
 */

/**
 * @typedef {MdBaseNode & { type: 'tableRow', children: TableCellNode[] }} TableRowNode
 */

/**
 * @typedef {MdBaseNode & { type: 'tableCell', children: MdNode[] }} TableCellNode
 */

/**
 * Matradown-specific nodes
 * @typedef {MdBaseNode & { type: 'variable', key: string }} VariableNode
 */

/**
 * @typedef {MdBaseNode & { type: 'directive', name: string, args?: string[], children: MdNode[] }} DirectiveNode
 */

/**
 * @typedef {MdBaseNode & { type: 'component', name: string, attrs: Record<string, string>, children: MdNode[] }} ComponentNode
 */

/**
 * @typedef {TextNode | ParagraphNode | HeadingNode | EmphasisNode | StrongNode | LinkNode | ImageNode | ListNode | ListItemNode | CodeNode | InlineCodeNode | BlockquoteNode | InlineMathNode | MathNode | TableNode | TableRowNode | TableCellNode | VariableNode | DirectiveNode | ComponentNode} MdNode
 */

/**
 * @typedef {Object} MatradownDocument
 * @property {string} [filename]
 * @property {Record<string, any>} [frontmatter]
 * @property {MdNode[]} children
 */

// ============================================================================
// Exports
// ============================================================================

export const MATRA_VERSION = '0.6.0'
