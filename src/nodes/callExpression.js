module.exports = {
    type: 'callExpression',
    transform(node, ctx) {
        // IdSelector, Rule
        const callee = this.Identifier(node);

        const context = {
            type: 'callExpression',
            callee,
            param: 'ctx'
        };

        const argument = this.ObjectExpression(ctx.block, context);

        return {
            type: 'callExpression',
            callee,
            argument
        };
    },
    transpile(node) {
        this.Node(node.callee);
        this.emit('(');
        this.Node(node.argument);
        this.emit(')');
    }
}