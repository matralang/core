const VOID_ELEMENTS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
]);
/** Render a Matra AST using HTML semantics. */
export function toHTML(ast, options = {}) {
    if (isMatraAST(ast))
        return renderNode(ast, options);
    return ast.map(child => renderChild(child, options)).join("");
}
function renderNode(node, options) {
    const { tag, props, children } = node;
    if (tag === (options.rootTag ?? "$root")) {
        return children.map(child => renderChild(child, options)).join("");
    }
    if (tag === "#comment") {
        return `<!--${String(children[0] ?? "")}-->`;
    }
    const attrs = renderProps(props);
    if (VOID_ELEMENTS.has(tag.toLowerCase()))
        return `<${tag}${attrs}>`;
    const content = children.map(child => renderChild(child, options)).join("");
    return `<${tag}${attrs}>${content}</${tag}>`;
}
function renderChild(child, options) {
    if (isMatraAST(child))
        return renderNode(child, options);
    if (child === null)
        return "";
    if (typeof child === "object")
        return escapeHTML(JSON.stringify(child));
    return escapeHTML(String(child));
}
function renderProps(props) {
    return Object.entries(props)
        .filter(([, value]) => value !== null && value !== false)
        .map(([key, value]) => {
        if (value === true)
            return ` ${key}`;
        const serialized = Array.isArray(value) ? value.join(" ") : String(value);
        return ` ${key}="${escapeAttribute(serialized)}"`;
    })
        .join("");
}
function escapeHTML(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
function escapeAttribute(value) {
    return escapeHTML(value);
}
function isMatraAST(value) {
    return (value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        "tag" in value &&
        typeof value.tag === "string" &&
        "props" in value &&
        value.props !== null &&
        typeof value.props === "object" &&
        !Array.isArray(value.props) &&
        "children" in value &&
        Array.isArray(value.children));
}
export default { toHTML };
//# sourceMappingURL=index.js.map