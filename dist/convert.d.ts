import type { MatraAST, MatraJSON } from "./types.js";
export declare function isMatraAST(value: unknown): value is MatraAST;
export declare function isMatraJSON(value: unknown): value is MatraJSON;
/** Convert the compact internal AST to the object-shaped interchange form. */
export declare function astToMatraJSON(ast: MatraAST): MatraJSON;
/** Convert the object-shaped interchange form to the compact internal AST. */
export declare function matraJSONToAST(node: MatraJSON): MatraAST;
