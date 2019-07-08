const visit = require('unist-util-visit');
// This is a Remark *transformer*, i.e. it works off a unist AST.
const isParent = (node) => !!node.children;
/**
 * Attaches a `className` on each emoji in a parent node _if_ that node only
 * consists of emojis.
 */
export const traverseEmojis = (opts = {}) => (tree) => visit(tree, 'paragraph', (node) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktdHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdHJhbnNmb3JtZXJzL2Vtb2ppLXRyYW5zZm9ybWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRzFDLGlFQUFpRTtBQUVqRSxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVUsRUFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBRSxJQUFlLENBQUMsUUFBUSxDQUFDO0FBZTdFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLE9BQWdCLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUNqRSxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLElBQVUsRUFBRSxFQUFFO0lBQ3BDLE1BQU0sRUFBRSxTQUFTLEdBQUcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRTdELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2hCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUNwQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLENBQ3BDLENBQUM7UUFFRixvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLFFBQVE7YUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO2FBQ2pDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQWlCLENBQUM7WUFFckMsOENBQThDO1lBQzlDLElBQUksQ0FBQyxXQUFXLHFCQUNULElBQUksQ0FBQyxXQUFXLElBQ25CLFNBQVMsR0FDWixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFUCxJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsc0JBQXNCLEVBQUU7WUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDNUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQWlCLENBQUM7Z0JBRXJDLDhDQUE4QztnQkFDOUMsSUFBSSxDQUFDLFdBQVcscUJBQ1QsSUFBSSxDQUFDLFdBQVcsSUFDbkIsU0FBUyxFQUFFO3dCQUNQLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxJQUFJLEVBQUU7d0JBQ2hDLHNCQUFzQjtxQkFDekI7eUJBQ0ksSUFBSSxDQUFDLEdBQUcsQ0FBQzt5QkFDVCxJQUFJLEVBQUUsR0FDZCxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQztLQUNyQjtBQUNMLENBQUMsQ0FBQyxDQUFDIn0=