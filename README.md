# React Remark

> Create React components out of [Remark](https://github.com/remarkjs/remark).

More practically: render React components from Markdown formatted text, with emoji support ✨

Supports:

- Creating a React component – ready to be rendered – from an existing Remark processor pipeline.
- Optionally transforming emoji :shortcodes: to unicode.
- Sanitizing the Markdown text input.
- Setting a custom top-level class name.

## Install

```bash
npm install --save github:lookback/remark-react-component
```

## Usage

```jsx
import unified from 'unified';
import markdown from 'remark-parse';
import { createComponentFromProcessor } from 'remark-react-component';
import { emojis } from 'remark-react-component/emojis';

import React from 'react';
import { render } from 'react-dom';

const processor = unified()
  // This is the Markdown parser
  .use(markdown)
  .use(emojis);
  // You may use any other Unified plugins here..

const App = () => {
  const MyMarkdownComponent = createComponentFromProcessor(processor);

  return <MyMarkdownComponent text="# Hi there :smile:" />;
};

render(<App />, document.getElementbyId('app'));
```

## API

### `createComponentFromProcessor`

Factory function for creating a React component from a processor.

```ts
import { Node } from 'unist';
import { createComponentFromProcessor } from 'remark-react-component';

function createComponentFromProcessor(
  processor: unified.Processor,
  options?: Options): React.ComponentType<Props>;

interface Props {
    text: string | null;
    wrapIn?: string;
    className?: string;
    transformers?: ((node: Node) => void)[];
}

interface Options {
    createElement?: CreateElement;
    components?: {
        [key: string]: React.ComponentType;
    };
    sanitizeSchema?: any;
}
```

#### `processor: unified.Processor`

A [Unified processor](https://github.com/unifiedjs/unified#processor).

You *must* hook on the [`remark-parse`](https://github.com/remarkjs/remark/tree/master/packages/remark-parse) function in the processor `use()` function. This is because this module works off of the [mdast](https://github.com/syntax-tree/mdast) produced by `remark-parse`.

#### `options.createElement?`

Provide a custom function for creating the component, based on the Remark processor output. Defaults to `React.createElement`.

#### `options.components?: { [key: string] }: Component }`

Override the default HTML elements. Example:

```jsx
const processor = unified.use(markdown);

const MyH1 = (props) => <h1 className="my-h1">{props.children}</h1>;

const Markdown = createComponentFromProcessor(processor, {
  components: {
    // Overrides `h1` with `MyH1`
    h1: MyH1
  }
})
```

#### `options.sanitizeSchema?: any`

An object passed directly to the [`sanitize`](https://github.com/syntax-tree/hast-util-sanitize) function, configuring how to sanitize the incoming Markdown.

Defaults to [GitHub's schema](https://github.com/syntax-tree/hast-util-sanitize/blob/master/lib/github.json).

### Props of the returned component

### `props.text: string`

Required. The text to parse.

### `props.wrapIn?: string`

If specified, we'll wrap the parsed Markdown in this element.

### `props.className?: string`

If specified, we'll add this class to a wrapper `div` around the parsed Markdown.

### `props.transformers?: Transformer[]`

An optional array of *Transformers* on the parsed MDAST. Use this to walk the AST and modify it. See `src/transformers/emoji-transformer.ts` for an example. You can use the [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit) to traverse the tree.

Read more in the [Unified README](https://github.com/unifiedjs/unified#description).

We'll apply each transformer in the array (in order) to the newly parsed MDAST, from `remark-parse`.

## Emojis

We don't provide emoji support as default, since we wanna keep the default bundle size low. But you can import the code needed from this module and plug it in yourself:

```js
import unified from 'unified';
import markdown from 'remark-parse';
import { emojis, addEmojiClasses } from 'remark-react-component/emojis';

const processor = unified()
  .use(markdown)
  // Parses emojis from text
  .use(emojis);

const MyMarkdownComponent = createComponentFromProcessor(processor, {
  // The emoji transformer adds appropriate class names to the emojis
  // so you can target them with CSS.
  transformers: [addEmojiClasses()]
})
```

### `emojis`

Adds support for finding emojis from text. Essentially a tokenizer plugin for Unified.

```ts
import { emojis } from 'remark-react-component/emojis';

function emojis(options?: TokenizerOptions): void;
```

Takes an options object as second parameter to the Unified `use` function.

```ts
interface TokenizerOptions {
    /** What HTML tag each emoji should be wrapped with. */
    tag: string;
}
```

```js
unified()
  .use(markdown)
  // Specify options as second argument to `use`:
  .use(emojis, {
    tag: 'strong'
  });
```

### `addEmojiClasses`

Adds appropriate class names to the parsed emojis. It's essentially a transformer function which traverses the MDAST.

```ts
import { Node } from 'unist';
import { addEmojiClasses } from 'remark-react-component/emojis';

function addEmojiClasses(options?: Options): (tree: Node) => void;

interface Options {
    /** Class name for each wrapped emoji. */
    className?: string;
    /**
     * Class name for each wrapped emoji where the parent paragraph solely
     * consists of emojis.
     */
    classNameForOnlyEmojis?: string;
}
```

#### `options.className?: string`

Provide a string class name to be added to each parsed emoji. Defaults to `emoji`.

#### `options.classNameForOnlyEmojis?: string`

Provide a string class name to be added to each emoji when the parent paragraph *only* consists of emojis.

**Example**

This input text:

```
😏😄
```

would result in:

```html
<span class="emoji emoji-large">😏</span>
<span class="emoji emoji-large">😄</span>
```

## Tests

```bash
npm test
```

See `tests` directory.
