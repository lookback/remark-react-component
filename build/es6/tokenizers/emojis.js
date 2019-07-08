// tslint:disable no-object-mutation no-this
import { isRemarkParser } from '../remark-utils';
const emojiRegex = require('emoji-regex/es2015');
// From https://github.com/remarkjs/remark-gemoji
// Modified to emit a 'span' element instead of pure text for an emoji
const emojiByShortcode = require('gemoji').name;
const colon = ':';
const unicodeEmojiRegex = emojiRegex();
const own = {}.hasOwnProperty;
const defaultTokenizerOptions = { tag: 'span' };
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
export default function emoji(opts = {}) {
    const parser = this.Parser;
    if (!isRemarkParser(parser)) {
        throw new Error('Missing parser to attach to');
    }
    const proto = parser.prototype;
    const tokenizerOptions = Object.assign({}, defaultTokenizerOptions, opts);
    proto.inlineTokenizers.emojiShortCode = mkShortcodeTokenizer(tokenizerOptions);
    proto.inlineTokenizers.emojiUnicode = mkUnicodeEmojiTokenizer(tokenizerOptions);
    proto.inlineMethods.splice(proto.inlineMethods.indexOf('strong'), 0, 'emojiShortCode');
    proto.inlineMethods.splice(proto.inlineMethods.indexOf('emojiShortCode'), 0, 'emojiUnicode');
}
const createNode = (value, tag, properties) => ({
    type: 'emoji',
    data: {
        hName: tag,
        hProperties: properties,
    },
    children: [
        {
            type: 'text',
            value,
        },
    ],
});
/**
 * Tokenizer for wrapping unicode emojis, like 😏, in a Node.
 *
 * @see https://github.com/remarkjs/remark/tree/master/packages/remark-parse
 */
const mkUnicodeEmojiTokenizer = (opts) => {
    const { tag } = opts;
    const tokenize = (eat, value, silent) => {
        const matches = value.match(unicodeEmojiRegex);
        if (!matches) {
            return;
        }
        if (value.search(unicodeEmojiRegex) !== 0) {
            return;
        }
        if (silent) {
            return true;
        }
        return eat(matches[0])(createNode(matches[0], tag));
    };
    tokenize.locator = (value, fromIndex) => {
        // Fake lack of `fromIndex` in `String.prototype.search`.
        const indexInSubstring = value
            .substring(fromIndex)
            .search(unicodeEmojiRegex);
        return indexInSubstring < 0
            ? indexInSubstring
            : indexInSubstring + fromIndex;
    };
    return tokenize;
};
/** Tokenizer for finding and replacing :shortcode: emojis with their Unicode
 * representation, and wrapping in a Node.
 *
 * @see https://github.com/remarkjs/remark/tree/master/packages/remark-parse
 */
const mkShortcodeTokenizer = (opts) => {
    const { tag } = opts;
    const tokenize = (eat, value, silent) => {
        // Check if we are at a shortcode.
        if (value.charAt(0) !== colon) {
            return;
        }
        const pos = value.indexOf(colon, 1);
        if (pos === -1) {
            return;
        }
        // smile
        const subvalue = value.slice(1, pos);
        if (!own.call(emojiByShortcode, subvalue)) {
            return;
        }
        if (silent) {
            return true;
        }
        // :smile:
        const shortname = colon + subvalue + colon;
        const gemoji = emojiByShortcode[subvalue];
        // This is our element holding the emoji
        const newNode = createNode(gemoji.emoji, tag);
        return eat(shortname)(newNode);
    };
    tokenize.locator = (value, fromIndex) => value.indexOf(colon, fromIndex);
    return tokenize;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamlzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rva2VuaXplcnMvZW1vamlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQU01QyxPQUFPLEVBQWtCLGNBQWMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWpFLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBRWpELGlEQUFpRDtBQUNqRCxzRUFBc0U7QUFDdEUsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRWhELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNsQixNQUFNLGlCQUFpQixHQUFXLFVBQVUsRUFBRSxDQUFDO0FBRS9DLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7QUFJOUIsTUFBTSx1QkFBdUIsR0FBcUIsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFFbEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxNQUFNLENBQUMsT0FBTyxVQUFVLEtBQUssQ0FBa0IsT0FBZ0IsRUFBRTtJQUM3RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBRTNCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2xEO0lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUUvQixNQUFNLGdCQUFnQixxQkFDZix1QkFBdUIsRUFDdkIsSUFBSSxDQUNWLENBQUM7SUFFRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLG9CQUFvQixDQUN4RCxnQkFBZ0IsQ0FDbkIsQ0FBQztJQUNGLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEdBQUcsdUJBQXVCLENBQ3pELGdCQUFnQixDQUNu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