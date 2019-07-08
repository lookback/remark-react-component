"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toHAST = require('mdast-util-to-hast');
const toH = require('hast-to-hyperscript');
const sanitize = require('hast-util-sanitize');
const ghSchema = require('hast-util-sanitize/lib/github');
const deepmerge_1 = __importDefault(require("deepmerge"));
const defaultSanitizeSchema = deepmerge_1.default(ghSchema, {
    attributes: {
        '*': ['className'],
    },
});
const createReactElement = (() => {
    try {
        return require('react').createElement;
    }
    catch (ex) { }
})();
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
exports.mdastToReact = (processor, options = {}) => {
    const { components = {}, createElement = createReactElement, sanitizeSchema = defaultSanitizeSchema, } = options;
    if (!createElement) {
        throw new Error('react-remark: The provided `createElement` option is undefined.');
    }
    const h = (name, ...rest) => createElement(components[name] || name, ...rest);
    return (props) => {
        const { text, transformers, wrapIn } = props, rest = __rest(props, ["text", "transformers", "wrapIn"]);
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
        if (props.className || wrapIn) {
            return createElement(wrapIn || 'div', rest, root);
        }
        return root;
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRhc3QtdG8tcmVhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbWRhc3QtdG8tcmVhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBRy9DLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQzFELDBEQUE4QjtBQUU5QixNQUFNLHFCQUFxQixHQUFHLG1CQUFLLENBQUMsUUFBUSxFQUFFO0lBQzFDLFVBQVUsRUFBRTtRQUNSLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUNyQjtDQUNKLENBQUMsQ0FBQztBQUlILE1BQU0sa0JBQWtCLEdBQThCLENBQUMsR0FBRyxFQUFFO0lBQ3hELElBQUk7UUFDQSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUM7S0FDekM7SUFBQyxPQUFPLEVBQUUsRUFBRSxHQUFFO0FBQ25CLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFrQkw7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDVSxRQUFBLFlBQVksR0FBRyxDQUN4QixTQUFvQixFQUNwQixVQUFtQixFQUFFLEVBQ1MsRUFBRTtJQUNoQyxNQUFNLEVBQ0YsVUFBVSxHQUFHLEVBQUUsRUFDZixhQUFhLEdBQUcsa0JBQWtCLEVBQ2xDLGNBQWMsR0FBRyxxQkFBcUIsR0FDekMsR0FBRyxPQUFPLENBQUM7SUFFWixJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQ1gsaUVBQWlFLENBQ3BFLENBQUM7S0FDTDtJQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBWSxFQUFFLEdBQUcsSUFBVyxFQUFPLEVBQUUsQ0FDNUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUVyRCxPQUFPLENBQUMsS0FBWSxFQUFFLEVBQUU7UUFDcEIsTUFBTSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsTUFBTSxLQUFjLEtBQUssRUFBakIsd0RBQWlCLENBQUM7UUFFdEQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxxREFBcUQ7UUFDckQsbUVBQW1FO1FBQ25FLHNFQUFzRTtRQUN0RSxFQUFFO1FBQ0YsNkVBQTZFO1FBQzdFLGtDQUFrQztRQUNsQyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxDLElBQUksWUFBWSxFQUFFO1lBQ2QsS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2I7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFFcEQsSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLE1BQU0sRUFBRTtZQUMzQixPQUFPLGFBQWEsQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyJ9