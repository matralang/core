# @matralang/matra-html

[English](./README.md) | [日本語](./README.ja.md)

HTML semantics for the domain-neutral Matra AST.

```ts
import { parse } from "@matralang/core"
import { toHTML } from "@matralang/matra-html"

toHTML(parse('p("Hello", class="lead")'))
```
