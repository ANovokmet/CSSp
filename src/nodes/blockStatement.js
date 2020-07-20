module.exports = {
    type: 'blockStatement',
    transform(node, ctx) {
        const body = [];
        
        node.children.forEach(child => {
            const statement = this.AssignmentExpression(child, ctx);
            body.push(statement);
        });

        const returnStatement = this.ReturnStatement(null, ctx);
        body.push(returnStatement);

        return {
            type: 'blockStatement',
            body
        };
    },
    transpile(node, ctx) {
        node.body.forEach(child => {
            switch(child.type) {
                case 'assignmentExpression':
                    this.AssignmentExpression(child, ctx);
                    break;
                case 'returnStatement':
                    this.ReturnStatement(child, ctx);
                    break;
                default:
                    this.error(child);
            }
            this.emit(';');
            this.newline();
        });
    }
}