module.exports = {
    type: 'assignmentExpression',
    transform(node, ctx) {
        // member expression
        let left;
        let right;

        if(node.left.type == 'TypeSelector') {
            left = this.Identifier(node.left);
        } else if(node.left) {
            left = this.MemberExpression({ object: ctx.param, property: node.left }); // `${ctx.param}.${node.left}`;
        } else {
            this.error(node.left);
        }

        if(node.right.type == 'IdSelector') {
            right = this.CallExpression(node.right, ctx);
        } else if(node.right.type == 'Block') {
            right = this.ObjectExpression(node.right, ctx);
        } else if(node.right.type == 'Value') {
            right = this.ValueExpression(node.right, ctx);
        } else {
            this.error(node.right);
        }

        return {
            type: 'assignmentExpression',
            operator: '=',
            left,
            right
        };
    },
    transpile(node, ctx) {
        this.Node(node.left);
        this.emit(` ${node.operator} `);
        this.Node(node.right);
    }
}