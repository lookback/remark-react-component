import { Processor } from 'unified';
declare type Options = Partial<TokenizerOptions>;
/**
 * This function is a plugin for Unified which detects emoji :shortnames:
 * in text and turns them into unicode. It also finds unicodes emojis.
 *
 * It'll wrap all found emojis in an AST node with type `emoji`.
 *
 * Usage:
 *
```ts
import unified from 'unified';
import markdown from 'remark-parse';

unified()
    .use(markdown)
    .use(emoji)
    .processSync('My :smile:');
```
 *
 * @see https://github.com/unifiedjs/unified
 */
export default function emoji(this: Processor, opts?: Options): void;
interface TokenizerOptions {
    /** What HTML tag each emoji should be wrapped with. */
    tag: string;
}
export {};
