module.exports = {
    type: 'property',
    transform(node, ctx) {
        const key = this.Identifier(node.property);
        // identifier, literal or expression
        const value = this.ValueExpression(node.value, ctx);

        return {
            type: 'property',
            key,
            value
        };
    },
    transpile(node, ctx) {
        this.Node(node.key);
        this.emit(': ');
        this.Node(node.value);
    }
}