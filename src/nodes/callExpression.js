module.exports = {
    type: 'callExpression',
    transform(node) {
        const callee = this.Identifier(node.prelude);

        const context = {
            type: 'callExpression',
            callee,
            param: 'ctx'
        };

        const argument = this.ObjectExpression(node.block, context);

        return {
            type: 'callExpression',
            callee,
            argument
        };
    },
    transpile(node) {
        this.Identifier(node.callee);
        this.emit('(');
        this.ObjectExpression(node.argument);
        this.emit(')');
    }
}