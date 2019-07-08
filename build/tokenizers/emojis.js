"use strict";
// tslint:disable no-object-mutation no-this
Object.defineProperty(exports, "__esModule", { value: true });
const remark_utils_1 = require("../remark-utils");
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
function emoji(opts = {}) {
    const parser = this.Parser;
    if (!remark_utils_1.isRemarkParser(parser)) {
        throw new Error('Missing parser to attach to');
    }
    const proto = parser.prototype;
    const tokenizerOptions = Object.assign({}, defaultTokenizerOptions, opts);
    proto.inlineTokenizers.emojiShortCode = mkShortcodeTokenizer(tokenizerOptions);
    proto.inlineTokenizers.emojiUnicode = mkUnicodeEmojiTokenizer(tokenizerOptions);
    proto.inlineMethods.splice(proto.inlineMethods.indexOf('strong'), 0, 'emojiShortCode');
    proto.inlineMethods.splice(proto.inlineMethods.indexOf('emojiShortCode'), 0, 'emojiUnicode');
}
exports.default = emoji;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamlzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rva2VuaXplcnMvZW1vamlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBNEM7O0FBTTVDLGtEQUFpRTtBQUVqRSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUVqRCxpREFBaUQ7QUFDakQsc0VBQXNFO0FBQ3RFLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUVoRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDbEIsTUFBTSxpQkFBaUIsR0FBVyxVQUFVLEVBQUUsQ0FBQztBQUUvQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO0FBSTlCLE1BQU0sdUJBQXVCLEdBQXFCLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBRWxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsU0FBd0IsS0FBSyxDQUFrQixPQUFnQixFQUFFO0lBQzdELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFM0IsSUFBSSxDQUFDLDZCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2xEO0lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUUvQixNQUFNLGdCQUFnQixxQkFDZix1QkFBdUIsRUFDdkIsSUFBSSxDQUNWLENBQUM7SUFFRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLG9CQUFvQixDQUN4RCxnQkFBZ0IsQ0FDbkIsQ0FBQztJQUNGLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEdBQUcsdUJBQXVCLENBQ3pELGdCQUFnQixDQUNuQixDQUFDO0lBRUYsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQ3RCLEtB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