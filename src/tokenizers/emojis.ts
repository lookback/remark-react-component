// tslint:disable no-object-mutation no-this

// This module is including tokenizers for emojis (unicode and shortcodes)
// for Remark.

import { Processor } from 'unified';
import { Tokenizer, Eat, isRemarkParser } from '../remark-utils';
import { Node } from 'unist';
const emojiRegex = require('emoji-regex/es2015');

// From https://github.com/remarkjs/remark-gemoji
// Modified to emit a 'span' element instead of pure text for an emoji
const emojiByShortcode = require('gemoji').name;

const colon = ':';
const unicodeEmojiRegex: RegExp = emojiRegex();

const own = {}.hasOwnProperty;

type Options = Partial<TokenizerOptions>;

const defaultTokenizerOptions: TokenizerOptions = { tag: 'span' };

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
export default function emoji(this: Processor, opts: Options = {}): void {
    const parser = this.Parser;

    if (!isRemarkParser(parser)) {
        throw new Error('Missing parser to attach to');
    }

    const proto = parser.prototype;

    const tokenizerOptions = {
        ...defaultTokenizerOptions,
        ...opts,
    };

    proto.inlineTokenizers.emojiShortCode = mkShortcodeTokenizer(
        tokenizerOptions
    );
    proto.inlineTokenizers.emojiUnicode = mkUnicodeEmojiTokenizer(
        tokenizerOptions
    );

    proto.inlineMethods.splice(
        proto.inlineMethods.indexOf('strong'),
        0,
        'emojiShortCode'
    );

    proto.inlineMethods.splice(
        proto.inlineMethods.indexOf('emojiShortCode'),
        0,
        'emojiUnicode'
    );
}

interface TokenizerOptions {
    /** What HTML tag each emoji should be wrapped with. */
    tag: string;
}

const createNode = (value: string, tag: string, properties?: any): Node => ({
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
const mkUnicodeEmojiTokenizer = (opts: TokenizerOptions): Tokenizer => {
    const { tag } = opts;

    const tokenize: Tokenizer = (eat: Eat, value: string, silent?: boolean) => {
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

    tokenize.locator = (value: string, fromIndex: number) => {
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
const mkShortcodeTokenizer = (opts: TokenizerOptions): Tokenizer => {
    const { tag } = opts;

    const tokenize: Tokenizer = (eat: Eat, value: string, silent?: boolean) => {
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

    tokenize.locator = (value: string, fromIndex: number) =>
        value.indexOf(colon, fromIndex);

    return tokenize;
};
