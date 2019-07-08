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
const toHAST = require('mdast-util-to-hast');
const toH = require('hast-to-hyperscript');
const sanitize = require('hast-util-sanitize');
const ghSchema = require('hast-util-sanitize/lib/github');
import merge from 'deepmerge';
const defaultSanitizeSchema = merge(ghSchema, {
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
export const mdastToReact = (processor, options = {}) => {
    const { components = {}, createElement = createReactElement, sanitizeSchema = defaultSanitizeSchema, transformers, } = options;
    if (!createElement) {
        throw new Error('react-remark: The provided `createElement` option is undefined.');
    }
    const h = (name, ...rest) => createElement(components[name] || name, ...rest);
    return (props) => {
        const { text } = props, rest = __rest(props, ["text"]);
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
        if (props.className) {
            return createElement('div', rest, root);
        }
        return root;
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRhc3QtdG8tcmVhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWRhc3QtdG8tcmVhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM3QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMzQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUcvQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUMxRCxPQUFPLEtBQUssTUFBTSxXQUFXLENBQUM7QUFFOUIsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFO0lBQzFDLFVBQVUsRUFBRTtRQUNSLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUNyQjtDQUNKLENBQUMsQ0FBQztBQUlILE1BQU0sa0JBQWtCLEdBQThCLENBQUMsR0FBRyxFQUFFO0lBQ3hELElBQUk7UUFDQSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUM7S0FDekM7SUFBQyxPQUFPLEVBQUUsRUFBRSxHQUFFO0FBQ25CLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFpQkw7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsQ0FDeEIsU0FBb0IsRUFDcEIsVUFBbUIsRUFBRSxFQUNTLEVBQUU7SUFDaEMsTUFBTSxFQUNGLFVBQVUsR0FBRyxFQUFFLEVBQ2YsYUFBYSxHQUFHLGtCQUFrQixFQUNsQyxjQUFjLEdBQUcscUJBQXFCLEVBQ3RDLFlBQVksR0FDZixHQUFHLE9BQU8sQ0FBQztJQUVaLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FDWCxpRUFBaUUsQ0FDcEUsQ0FBQztLQUNMO0lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFZLEVBQUUsR0FBRyxJQUFXLEVBQU8sRUFBRSxDQUM1QyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRXJELE9BQU8sQ0FBQyxLQUFZLEVBQUUsRUFBRTtRQUNwQixNQUFNLEVBQUUsSUFBSSxLQUFjLEtBQUssRUFBakIsOEJBQWlCLENBQUM7UUFFaEMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxxREFBcUQ7UUFDckQsbUVBQW1FO1FBQ25FLHNFQUFzRTtRQUN0RSxFQUFFO1FBQ0YsNkVBQTZFO1FBQzdFLGtDQUFrQztRQUNsQyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxDLElBQUksWUFBWSxFQUFFO1lBQ2QsS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2I7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFFcEQsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ2pCLE9BQU8sYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0M7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUM7QUFDTixDQUFDLENBQUMifQ==