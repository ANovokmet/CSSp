module.exports = {
    type: 'expressionStatement',
    transform(node) {
        const expression = this.CallExpression(node);
        return {
            type: 'expressionStatement',
            expression
        };
    },
    transpile(node) {
        this.Node(node.expression);
        if(node.expression.type != 'functionDeclaration')
            this.emit(';');
    }
}