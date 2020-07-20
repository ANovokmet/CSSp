module.exports = {
    type: 'assignmentExpression',
    transform(node, ctx) {
        // member expression
        const left = `${ctx.param}.${node.property}`;
        // identifier, literal or expression
        const right = this.ValueExpression(node.value, ctx);

        return {
            type: 'assignmentExpression',
            operator: '=',
            left,
            right
        };
    },
    transpile(node, ctx) {
        this.emit(`${node.left} ${node.operator} `);
        this.ValueExpression(node.right);
    }
}