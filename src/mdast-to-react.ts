const toHAST = require('mdast-util-to-hast');
const toH = require('hast-to-hyperscript');
const sanitize = require('hast-util-sanitize');
import { Processor } from 'unified';
import { Node } from 'unist';
const ghSchema = require('hast-util-sanitize/lib/github');
import merge from 'deepmerge';

const defaultSanitizeSchema = merge(ghSchema, {
    attributes: {
        '*': ['className'],
    },
});

type CreateElement = (tag: any, props?: any, children?: any) => any;

const createReactElement: CreateElement | undefined = (() => {
    try {
        return require('react').createElement;
    } catch (ex) {}
})();

export interface Props {
    text: string | null;
    className?: string;
}

export interface Options {
    sanitizeSchema?: any;
    /** Transforms the MDAST tree. */
    transformers?: ((node: Node) => void)[];
    createElement?: CreateElement;
    components?: {
        [key: string]: React.ComponentType;
    };
}

/**
 * Take a Unified processor pipeline and turn it into a React component.
 *
 * Usage:
```tsx
const pipeline = unified()
    .use(markdown)
    .use(someOtherPlugin);

const Markdown = mdastToReact(pipeline);

// Render
<Markdown text="# Hi there!" />
```
 * @param processor The Unified processor
 * @see https://github.com/unifiedjs/unified
 */
export const mdastToReact = (
    processor: Processor,
    options: Options = {}
): React.FunctionComponent<Props> => {
    const {
        components = {},
        createElement = createReactElement,
        sanitizeSchema = defaultSanitizeSchema,
        transformers,
    } = options;

    if (!createElement) {
        throw new Error(
            'react-remark: The provided `createElement` option is undefined.'
        );
    }

    const h = (name: string, ...rest: any[]): any =>
        createElement(components[name] || name, ...rest);

    return (props: Props) => {
        const { text, ...rest } = props;

        if (!text) {
            return null;
        }

        // This process is actually kinda simple and elegant:
        // we process the MDAST (Markdown AST) into a HAST (Hypertext AST),
        // then into a Hyperscript tree, and feed it to `React.createElement`.
        //
        // text -> unified.parse -> MDAST -> sanitize -> HAST -> Hyperscript -> React
        // tslint:disable-next-line no-let
        let mdast = processor.parse(text);

        if (transformers) {
            mdast = transformers.reduce((node, transform) => {
                transform(node);
                return node;
            }, mdast);
        }

        const tree = toHAST(mdast);

        const root = toH(h, sanitize(tree, sanitizeSchema));

        if (props.className) {
            return createElement('div', rest, root);
        }

        return root;
    };
};
