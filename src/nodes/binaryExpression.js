module.exports = {
    type: 'binaryExpression',
    transform(left, right, operator) {
        return {
            type: 'binaryExpression',
            left,
            operator,
            right
        };
    },
    transpile(node) {
        this.Node(node.left);
        this.emit(` ${node.operator} `);
        this.Node(node.right);
    }
}