const { sanitize } = require('../utils');

module.exports = {
    type: 'identifier',
    transform(node) {
        let name;

        if (typeof node == 'string') {
            name = sanitize(node);
        } else {
            switch (node.type) {
                case 'ClassSelector':
                case 'TypeSelector':
                case 'IdSelector':
                case 'Identifier':
                    name = sanitize(node.name);
                    break;
                default:
                    throw new Error(`Identifier: no case for ${node.type}`);
            }
        }

        return {
            type: 'identifier',
            name
        };
    },
    transpile(node) {
        this.emit(node.name);
    }
}