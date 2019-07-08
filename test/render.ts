import { test } from 'loltest';
import unified from 'unified';
import assert from 'assert';
import TestRenderer from 'react-test-renderer';

import { createComponentFromProcessor } from '../src';

import { emojis } from '../src/emojis';
import { createElement } from 'react';

const markdown = require('remark-parse');
const hyper = require('hyperscript');

test('render Markdown as a React component', () => {
    const pipe = unified().use(markdown);

    const Component = createComponentFromProcessor(pipe);

    const render = TestRenderer.create(Component({ text: '# Hej' })!);

    assert.deepStrictEqual(render.toJSON(), {
        type: 'h1',
        props: {},
        children: ['Hej'],
    });
});

test('render a shortcode emoji', () => {
    const pipe = unified()
        .use(markdown)
        .use(emojis);

    const Component = createComponentFromProcessor(pipe);

    const render = TestRenderer.create(Component({ text: 'Hej :smile:' })!);

    assert.deepStrictEqual(render.toJSON(), {
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
    });
});

test('render a unicode emoji', () => {
    const pipe = unified()
        .use(markdown)
        .use(emojis);

    const Component = createComponentFromProcessor(pipe);

    const render = TestRenderer.create(Component({ text: 'Hej 😄' })!);

    assert.deepStrictEqual(render.toJSON(), {
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
    });
});

test('render multiple emojis', () => {
    const pipe = unified()
        .use(markdown)
        .use(emojis);

    const Component = createComponentFromProcessor(pipe);

    const render = TestRenderer.create(Component({ text: 'Hej 😄:smirk:' })!);

    assert.deepStrictEqual(render.toJSON(), {
        type: 'p',
        props: {},
        children: [
            'Hej ',
            {
                props: {},
                type: 'span',
                children: ['😄'],
            },
            {
                props: {},
                type: 'span',
                children: ['😏'],
            },
        ],
    });
});

test('support specifying custom component replacements', () => {
    const pipe = unified().use(markdown);

    const MyCustomH1 = (props: any) =>
        createElement('h1', { className: 'my-h1' }, props.children);

    const Component = createComponentFromProcessor(pipe, {
        components: {
            h1: MyCustomH1,
        },
    });

    const render = TestRenderer.create(Component({ text: '# Hej' })!);

    assert.deepStrictEqual(render.toJSON(), {
        type: 'h1',
        props: { className: 'my-h1' },
        children: ['Hej'],
    });
});

test("support using a custom createElement function (rather than React's)", () => {
    const pipe = unified().use(markdown);

    const Component = createComponentFromProcessor(pipe, {
        createElement: (type: any, props?: any, children?: any[]) =>
            hyper(type, { class: 'custom' }, children),
    });

    // XXX Cast React.ComponentType to any here, as I haven't come up
    // with a solution for dynamically setting the return type of Component
    // based on the return type of `options.createElement`.
    const render = Component({ text: '# Hej' }) as any;

    assert.strictEqual(render.outerHTML, '<h1 class="custom">Hej</h1>');
});
