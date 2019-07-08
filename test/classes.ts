import { test } from 'loltest';
import unified from 'unified';
import assert from 'assert';
import TestRenderer from 'react-test-renderer';

import { createComponentFromProcessor } from '../src';

const markdown = require('remark-parse');
import { emojis, addEmojiClasses } from '../src/emojis';

test('support top-level class name on component', () => {
    const pipe = unified()
        .use(markdown)
        .use(emojis);

    const Component = createComponentFromProcessor(pipe);

    const render = TestRenderer.create(
        Component({ text: 'Hej 😄', className: 'my-class' })!
    );

    assert.deepStrictEqual(render.toJSON(), {
        type: 'div',
        props: { className: 'my-class' },
        children: [
            {
                type: 'p',
                props: {},
                children: [
                    'Hej ',
                    {
                        props: {},
                        type: 'span',
                        children: ['😄'],
                    },
                ],
            },
        ],
    });
});

test('support emoji classes through a transformer', () => {
    const pipe = unified()
        .use(markdown)
        .use(emojis);

    const Component = createComponentFromProcessor(pipe, {
        transformers: [addEmojiClasses()],
    });

    const render = TestRenderer.create(Component({ text: 'Hej 😄' })!);

    assert.deepStrictEqual(render.toJSON(), {
        type: 'p',
        props: {},
        children: [
            'Hej ',
            {
                props: { className: 'emoji' },
                type: 'span',
                children: ['😄'],
            },
        ],
    });
});

test('support "large" emoji class names when there are only emojis', () => {
    const pipe = unified()
        .use(markdown)
        .use(emojis);

    const Component = createComponentFromProcessor(pipe, {
        transformers: [
            addEmojiClasses({
                classNameForOnlyEmojis: 'emoji-large',
            }),
        ],
    });

    const render = TestRenderer.create(
        Component({
            text: '😄',
        })!
    );

    assert.deepStrictEqual(render.toJSON(), {
        type: 'p',
        props: {},
        children: [
            {
                props: { className: 'emoji emoji-large' },
                type: 'span',
                children: ['😄'],
            },
        ],
    });
});
