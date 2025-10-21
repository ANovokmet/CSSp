export default {
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
        if(node.properties.length > 1) {
            this.newline();
            this.indent();
            node.properties.forEach((child, i) => {
                this.Property(child, ctx);
                if(i !== node.properties.length - 1) this.emit(',');
                this.newline();
            });
            this.unindent();
        } else {
            node.properties.forEach((child, i) => {
                this.Property(child, ctx);
                if(i !== node.properties.length - 1) this.emit(',');
            });
        }
        this.emit('}');
    }
}