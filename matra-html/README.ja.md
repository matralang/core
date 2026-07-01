# @matralang/matra-html

[English](./README.md) | [日本語](./README.ja.md)

ドメイン非依存なMatra ASTにHTMLのセマンティクスを与えるパッケージです。

```ts
import { parse } from "@matralang/core"
import { toHTML } from "@matralang/matra-html"

toHTML(parse('p("Hello", class="lead")'))
```
