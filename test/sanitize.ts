import { test } from 'loltest';
import unified from 'unified';
import assert from 'assert';
import TestRenderer from 'react-test-renderer';

import { createComponentFromProcessor } from '../src';

const markdown = require('remark-parse');

test('strip any HTML elements', () => {
    const pipe = unified().use(markdown);

    const Component = createComponentFromProcessor(pipe);

    const render = TestRenderer.create(
        Component({
            text: `# Hej

<p>lol</p>

<style>* {margin:0}</style>
<script>alert(1);</script>

<a href="javascript:alert(1)">click</a>`,
        })!
    );

    assert.deepStrictEqual(render.toJSON(), {
        type: 'div',
        props: {},
        children: [
            {
                type: 'h1',
                props: {},
                children: ['Hej'],
            },
            '\n',
            {
                type: 'p',
                props: {},
                children: ['click'],
            },
        ],
    });
});
