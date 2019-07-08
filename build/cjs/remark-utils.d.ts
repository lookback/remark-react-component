import { Node } from 'unist';
export declare type Locator = (value: string, fromIndex: number) => number;
export declare type Add = (node: Node) => Node;
export declare type Eat = (value: string) => Add;
export interface Tokenizer {
    (eat: Eat, value: string, silent?: boolean): Node | boolean | undefined;
    locator: Locator;
}
export declare const isRemarkParser: (parser: any) => boolean;
