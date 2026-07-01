/** JSON-compatible values shared by AST props and children. */
export type MatraScalar = string | number | boolean | null;
export type MatraValue = MatraScalar | MatraValue[] | {
    [key: string]: MatraValue;
};
export type MatraProps = Record<string, MatraValue>;
/**
 * Matra's compact internal representation.
 *
 * A tag is domain-neutral: it can name an HTML element, a mathematical
 * operator, a document construct, or a graphics primitive.
 */
export type MatraAST = [
    tag: string,
    props: MatraProps,
    children: MatraASTChild[]
];
export type MatraASTChild = MatraAST | MatraValue;
/** Object-shaped interchange format used at parser and process boundaries. */
export interface MatraJSON {
    tag: string;
    props: MatraProps;
    children: MatraJSONChild[];
}
export type MatraJSONChild = MatraJSON | MatraValue;
export interface ParseOptions {
    grammarSource?: string;
    syntaxMode?: "mixed" | "document" | "application";
    [key: string]: unknown;
}
/** Minimal contract implemented by Peggy and other replaceable parsers. */
export interface MatraParser<Output = MatraAST | MatraJSON> {
    parse(source: string, options?: ParseOptions): Output;
}
export declare const MATRA_VERSION = "0.9.0";
