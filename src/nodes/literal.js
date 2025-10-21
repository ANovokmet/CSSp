export default {
    type: 'literal',
    transform(node) {
        let value;

        if(node.type == 'Number') {
            value = node.value;
        } else if (node.type == 'Identifier') {
            value = `'${node.name}'`;
        } else if (node.type == 'String') {
            value = `${node.value}`;
        }

        return {
            type: 'literal',
            value
        };
    },
    transpile(node) {
        this.emit(node.value);
    }
}