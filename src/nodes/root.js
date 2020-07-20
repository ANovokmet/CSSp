function getDeclarationNode(node) {

    const child = node.prelude.children.head.data/* Selector */.children.head.data/* ClassSelector */;
    
    if(child.type == 'ClassSelector')
        return this.FunctionDeclaration(node);

    if(child.type == 'IdSelector')
        return this.ExpressionStatement(node);
        
    throw new Error('Identifier: no case for', node);
}


module.exports = {
    type: 'root',
    transform(node) {
        const statements = [];

        node.children.forEach(child => {
            switch (child.type) {
                case 'Rule': 
                    // function declaration 
                    // or statement
                    const statement = getDeclarationNode.call(this, child);
                    statements.push(statement);
                    break;
                default:
                    this.error(child);
                    break;
            }
        });

        return {
            type: 'root',
            statements
        };
    },
    transpile(node) {
        node.statements.forEach(child => {
            switch(child.type) {
                case 'functionDeclaration':
                    this.FunctionDeclaration(child);
                    break;
                case 'expressionStatement':
                    this.ExpressionStatement(child);
                    this.emit(';');
                    break;
                default:
                    this.error(child);
            }
            this.newline(false);
        });
    }
}