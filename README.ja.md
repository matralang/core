# Matra Core

[English](./README.md) | [日本語](./README.ja.md)

Matra Coreは、HTML、Math、Docs、Graphicsの各パッケージで共有する、小さくドメイン非依存な基盤です。ツリー表現、相互変換、走査、変換、交換可能なParser境界を定義します。レンダリングとドメイン固有の評価処理はCoreの外に配置します。

## 2つのツリー表現

内部で使用するコンパクトなASTはタプル形式です。

```ts
["tag", { role: "example" }, ["text", ["child", {}, []]]]
```

Parserやプロセス間の交換形式にはMatraJSONを使用します。

```ts
{
  tag: "tag",
  props: { role: "example" },
  children: ["text", { tag: "child", props: {}, children: [] }]
}
```

境界では明示的に変換します。

```ts
import { astToMatraJSON, matraJSONToAST } from "@matralang/core"
```

## 交換可能なParser

Parserは`parse(source, options?)`メソッドを実装し、ASTまたはMatraJSONを返します。`parseWith()`は、どちらの出力もASTへ正規化します。

```ts
import { parseWith } from "@matralang/core"

const ast = parseWith(peggyParser, source)
```

現在同梱しているPeggy ParserはASTを直接返します。これは標準のアダプターであり、データモデルそのものには含まれません。

## HTML

HTMLレンダリングは、独立したworkspaceパッケージから提供します。

```ts
import { parse } from "@matralang/core"
import { toHTML } from "@matralang/matra-html"

toHTML(parse('p("Hello", class="lead")'))
```

関数形式の構文では、propsをPython風のキーワード引数で記述します。

```matra
circle(x=10, y=20, r=5)
```

通常の位置引数はchildrenになります。従来の`circle({x: 10, y: 20, r: 5})`形式も互換性のため利用できますが、標準記法ではありません。

## ドキュメントの言語

英語文書は`name.md`、対応する日本語文書は`name.ja.md`とします。変更を同期しやすくするため、見出し構造とコード例は両言語で揃えます。
