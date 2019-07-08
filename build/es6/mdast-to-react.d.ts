/// <reference types="react" />
import { Processor } from 'unified';
import { Node } from 'unist';
declare type CreateElement = (tag: any, props?: any, children?: any) => any;
export interface Props {
    text: string | null;
    className?: string;
    wrapIn?: string;
    /** Transforms the MDAST tree. */
    transformers?: ((node: Node) => void)[];
}
export interface Options {
    sanitizeSchema?: any;
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
export declare const mdastToReact: (processor: Processor, options?: Options) => import("react").FunctionComponent<Props>;
export {};
