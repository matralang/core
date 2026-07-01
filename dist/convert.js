export function isMatraAST(value) {
    return (Array.isArray(value) &&
        value.length === 3 &&
        typeof value[0] === "string" &&
        isRecord(value[1]) &&
        Array.isArray(value[2]));
}
export function isMatraJSON(value) {
    return (isRecord(value) &&
        typeof value.tag === "string" &&
        isRecord(value.props) &&
        Array.isArray(value.children));
}
/** Convert the compact internal AST to the object-shaped interchange form. */
export function astToMatraJSON(ast) {
    const [tag, props, children] = ast;
    return {
        tag,
        props: cloneValue(props),
        children: children.map(childToJSON),
    };
}
/** Convert the object-shaped interchange form to the compact internal AST. */
export function matraJSONToAST(node) {
    return [
        node.tag,
        cloneValue(node.props),
        node.children.map(childToAST),
    ];
}
function childToJSON(child) {
    return isMatraAST(child) ? astToMatraJSON(child) : cloneValue(child);
}
function childToAST(child) {
    return isMatraJSON(child) ? matraJSONToAST(child) : cloneValue(child);
}
function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
function cloneValue(value) {
    if (Array.isArray(value))
        return value.map(item => cloneValue(item));
    if (isRecord(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)]));
    }
    return value;
}
//# sourceMappingURL=convert.js.map