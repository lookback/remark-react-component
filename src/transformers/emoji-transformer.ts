const visit = require('unist-util-visit');
import { Node, Parent, Data } from 'unist';

// This is a Remark *transformer*, i.e. it works off a unist AST.

const isParent = (node: Node): node is Parent => !!(node as Parent).children;

interface EmojiData extends Data {
    hProperties: any;
}

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
export const traverseEmojis = (opts: Options = {}) => (tree: Node) =>
    visit(tree, 'paragraph', (node: Node) => {
        const { className = 'emoji', classNameForOnlyEmojis } = opts;

        if (isParent(node)) {
            const allAreEmojis = node.children.every(
                (child) => child.type === 'emoji'
            );

            // Traverse through all child emojis
            node.children
                .filter((n) => n.type === 'emoji')
                .forEach((emoji) => {
                    const data = emoji.data as EmojiData;

                    // tslint:disable-next-line no-object-mutation
                    data.hProperties = {
                        ...data.hProperties,
                        className,
                    };
                });

            if (allAreEmojis && !!classNameForOnlyEmojis) {
                node.children.forEach((child) => {
                    const data = child.data as EmojiData;

                    // tslint:disable-next-line no-object-mutation
                    data.hProperties = {
                        ...data.hProperties,
                        className: [
                            data.hProperties.className || '',
                            classNameForOnlyEmojis,
                        ]
                            .join(' ')
                            .trim(),
                    };
                });
            }

            return visit.skip;
        }
    });
