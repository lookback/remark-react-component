"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visit = require('unist-util-visit');
// This is a Remark *transformer*, i.e. it works off a unist AST.
const isParent = (node) => !!node.children;
/**
 * Attaches a `className` on each emoji in a parent node _if_ that node only
 * consists of emojis.
 */
exports.traverseEmojis = (opts = {}) => (tree) => visit(tree, 'paragraph', (node) => {
    const { className = 'emoji', classNameForOnlyEmojis } = opts;
    if (isParent(node)) {
        const allAreEmojis = node.children.every((child) => child.type === 'emoji');
        // Traverse through all child emojis
        node.children
            .filter((n) => n.type === 'emoji')
            .forEach((emoji) => {
            const data = emoji.data;
            // tslint:disable-next-line no-object-mutation
            data.hProperties = Object.assign({}, data.hProperties, { className });
        });
        if (allAreEmojis && !!classNameForOnlyEmojis) {
            node.children.forEach((child) => {
                const data = child.data;
                // tslint:disable-next-line no-object-mutation
                data.hProperties = Object.assign({}, data.hProperties, { className: [
                        data.hProperties.className || '',
                        classNameForOnlyEmojis,
                    ]
                        .join(' ')
                        .trim() });
            });
        }
        return visit.skip;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktdHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNmb3JtZXJzL2Vtb2ppLXRyYW5zZm9ybWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFHMUMsaUVBQWlFO0FBRWpFLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBVSxFQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFFLElBQWUsQ0FBQyxRQUFRLENBQUM7QUFlN0U7OztHQUdHO0FBQ1UsUUFBQSxjQUFjLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBVSxFQUFFLEVBQUUsQ0FDakUsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFVLEVBQUUsRUFBRTtJQUNwQyxNQUFNLEVBQUUsU0FBUyxHQUFHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxHQUFHLElBQUksQ0FBQztJQUU3RCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FDcEMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUNwQyxDQUFDO1FBRUYsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxRQUFRO2FBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQzthQUNqQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNmLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFpQixDQUFDO1lBRXJDLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsV0FBVyxxQkFDVCxJQUFJLENBQUMsV0FBVyxJQUNuQixTQUFTLEdBQ1osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRVAsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDLHNCQUFzQixFQUFFO1lBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQzVCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFpQixDQUFDO2dCQUVyQyw4Q0FBOEM7Z0JBQzlDLElBQUksQ0FBQyxXQUFXLHFCQUNULElBQUksQ0FBQyxXQUFXLElBQ25CLFNBQVMsRUFBRTt3QkFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFO3dCQUNoQyxzQkFBc0I7cUJBQ3pCO3lCQUNJLElBQUksQ0FBQyxHQUFHLENBQUM7eUJBQ1QsSUFBSSxFQUFFLEdBQ2QsQ0FBQztZQUNOLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUM7S0FDckI7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9