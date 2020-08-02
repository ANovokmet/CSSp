module.exports = {
    type: 'memberExpression',
    transform(node, ctx) {
        let object;
        let property;

        if(node.object.type == 'TypeSelector') {
            object = this.Identifier(node.object);
        } else if(node.object) {
            object = this.Identifier(node.object);
        } else {
            this.error(node);
        }

        if(node.property.type == 'IdSelector') {
            property = this.CallExpression(node.property, ctx);
        } else if(node.property) {
            property = this.Identifier(node.property);
        } else {
            this.error(node);
        }

        return {
            type: 'memberExpression',
            object,
            property
        };
    },
    transpile(node, ctx) {
        this.Node(node.object);
        this.emit('.');
        this.Node(node.property);
    }
}