import { Node } from 'unist';
interface Options {
    /** Class name for each wrapped emoji. */
    className?: string;
    /** Class name for each wrapped emoji where the parent paragraph solely
     * consists of emojis.
     */
    classNameForOnlyEmojis?: string;
}
/**
 * Attaches a `className` on each emoji in a parent node _if_ that node only
 * consists of emojis.
 */
export declare const traverseEmojis: (opts?: Options) => (tree: Node) => any;
export {};
