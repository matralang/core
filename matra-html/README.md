# @butchi/matra-html

[English](./README.md) | [日本語](./README.ja.md)

HTML semantics for the domain-neutral Matra AST.

```ts
import { parse } from "@butchi/matra-core"
import { toHTML } from "@butchi/matra-html"

toHTML(parse('p("Hello", class="lead")'))
```
