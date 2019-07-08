import { Node } from 'unist';

// Types and utils for Remark

export type Locator = (value: string, fromIndex: number) => number;
export type Add = (node: Node) => Node;
export type Eat = (value: string) => Add;

export interface Tokenizer {
    (eat: Eat, value: string, silent?: boolean): Node | boolean | undefined;
    locator: Locator;
}

export const isRemarkParser = (parser: any) =>
    Boolean(parser && parser.prototype && parser.prototype.inlineTokenizers);
