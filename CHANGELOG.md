# Changelog - @butchi/matra-core

## [0.6.0] - 2025-10-23

### Added

-   ✨ **Parser**: Peggy-based Matra syntax parser (`src/parser.mjs`)
-   ✨ **Type System**: Comprehensive type definitions for Matra & Matradown AST (`src/types.mjs`)
-   ✨ **Render Module**: HTML/JSON output generators (`src/render.mjs`)
-   ✨ **Compile API**: One-step parse-and-render function
-   📚 **JSDoc**: Full JSDoc type annotations for IDE support

### Core Features

-   **parse(source, opts)**: Parse Matra source code to AST
-   **toHTML(ast, opts)**: Render AST to HTML string
-   **toJSON(ast, opts)**: Serialize AST to JSON
-   **compile(source, opts)**: Parse and render in one step

### Infrastructure

-   🔗 npm link support for local development
-   🏗️ Build system with Peggy grammar compilation
-   ✅ Integrated with jp-butchi website project

### Migration from jp-butchi

Migrated production-tested implementations:

-   Matra syntax parser (matra-script-parser.peggy)
-   HTML rendering logic
-   Type definitions from Matradown

### Breaking Changes

-   None (initial stable release)

### Next Steps

-   [ ] Template evaluation (m-if, m-each, {{mustache}})
-   [ ] Matradown bridge (Markdown → Matra AST)
-   [ ] Plugin system
-   [ ] TypeScript type definitions (.d.ts)

---

## Development

Built and tested with:

-   Node.js v22.14.0
-   Peggy parser generator
-   ESM modules

## Integration

Used in production by:

-   **jp-butchi** (IWABUCHI Yuki Official Website)

---

© 2025 Yuki Iwabuchi / MIT License
