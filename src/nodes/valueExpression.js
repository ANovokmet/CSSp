module.exports = {
    type: 'valueExpression',
    transform(node, ctx) {
        let left;
        let right;
        let operator;

        node.children.forEach(child => {
            switch(child.type) {
                case 'Identifier':
                case 'String':
                case 'Number':
                    if(!left) {
                        left = this.Literal(child);
                    } else {
                        right = this.Literal(child);
                        left = this.BinaryExpression(left, right, operator);
                    }
                    break;
                case 'Operator':
                    operator = child.value;
                    break;
                case 'Function':
                    // var or calc
                    if(child.name == 'calc')
                        left = this.ValueExpression(child);
                    if(child.name == 'var')
                        left = this.Identifier(child.children.head.data, 'ctx.');
                    break;
                case 'WhiteSpace':
                default:
                    break;
            }
        });
        
        const child = node.children.head; //Number, Operator, WhiteSpace, Function

        return left;
    },
    transpile(node, ctx) {
        this.Node(node);
    }
}