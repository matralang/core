# Matra Core

[English](./README.md) | [日本語](./README.ja.md)

Matra Core is the small, domain-neutral foundation shared by HTML, Math,
Docs, and Graphics packages. It defines tree representations, conversion,
traversal, transformation, and a replaceable parser boundary. Rendering and
domain-specific evaluation live outside Core.

## Two tree representations

The compact internal AST is a tuple:

```ts
["tag", { role: "example" }, ["text", ["child", {}, []]]]
```

The parser/process interchange representation is MatraJSON:

```ts
{
  tag: "tag",
  props: { role: "example" },
  children: ["text", { tag: "child", props: {}, children: [] }]
}
```

Convert explicitly at the boundary:

```ts
import { astToMatraJSON, matraJSONToAST } from "@matralang/core"
```

## Replaceable parsers

A parser only needs a `parse(source, options?)` method and may return either
AST or MatraJSON. `parseWith()` normalizes both forms to AST.

```ts
import { parseWith } from "@matralang/core"

const ast = parseWith(peggyParser, source)
```

The currently bundled Peggy parser returns AST directly. It is a default
adapter, not part of the data model.

## HTML

HTML rendering is provided by the separate workspace package:

```ts
import { parse } from "@matralang/core"
import { toHTML } from "@matralang/matra-html"

toHTML(parse('p("Hello", class="lead")'))
```

Function-style syntax uses Python-like keyword arguments for props:

```matra
circle(x=10, y=20, r=5)
```

Ordinary positional arguments become children. The earlier
`circle({x: 10, y: 20, r: 5})` form remains available for compatibility but
is not the canonical notation.

## Documentation languages

English documents use `name.md`; their Japanese counterparts use
`name.ja.md`. Both versions should keep the same heading structure and code
examples so changes are easy to synchronize.
