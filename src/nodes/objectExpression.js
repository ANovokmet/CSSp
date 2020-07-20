module.exports = {
    type: 'objectExpression',
    transform(node, ctx) {
        const properties = [];
        
        node.children.forEach(child => {
            const property = this.Property(child, ctx);
            properties.push(property);
        });

        return {
            type: 'objectExpression',
            properties
        };
    },
    transpile(node, ctx) {
        this.emit('{');
        this.newline();
        this.indent();
        node.properties.forEach(child => {
            this.Property(child, ctx);
            this.emit(',');
            this.newline();
        });
        this.unindent();
        this.emit('}');
    }
}