module.exports = {
    type: 'callExpression',
    transform(node, ctx) {
        // IdSelector, Rule
        const callee = this.Identifier(node.callee);
        let argument;

        const context = {
            type: 'callExpression',
            callee,
            param: 'ctx'
        };

        if(node.argument.type == 'block') {
            argument = this.ObjectExpression(ctx.block, context);
        } else if(node.argument) {
            argument = this.Identifier(node.argument);
        }
        
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