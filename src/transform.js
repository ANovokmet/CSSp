const csstree = require('css-tree');
const nodeSettings = require('./nodes');

const transformer = {
    parse(source) {
        const root = this.source_ast = csstree.parse(source, { parseValue: true, parseCustomProperty: true });

        switch (root.type) {
            case 'StyleSheet':
                return this.Root(root);
                break;
            default:
                this.error(root);
                break;
        }
    },
    error(node) {
        throw new Error(`This.error transforming ${node.type} node`, node);
    }
}

for(const key in nodeSettings) {
    transformer[key] = nodeSettings[key].transform;
}

module.exports = transformer;