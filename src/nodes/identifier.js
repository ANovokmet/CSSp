module.exports = {
    type: 'identifier',
    transform(node) {
        // SelectorList, Identifier or null (in case of return)
        let name;

        switch (node.type) {
            case 'SelectorList':
                const child = node.children.head.data/* Selector */.children.head.data/* ClassSelector */;
                name = child.name;
                break;
            case 'Identifier':
                name = node.name;
                break;
            default:
                throw new Error('Identifier: no case for', node);
                break;
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