module.exports = {
    type: 'property',
    transform(node, ctx) {
        const key = node.property;
        // identifier, literal or expression
        const value = this.ValueExpression(node.value, ctx);

        return {
            type: 'property',
            key,
            value
        };
    },
    transpile(node, ctx) {
        this.emit(`${node.key}: `);
        this.ValueExpression(node.value);
    }
}