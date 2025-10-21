export default {
    type: 'functionDeclaration',
    transform(node, ctx) {
        const identifier = this.Identifier(node);

        const context = {
            type: 'functionDeclaration',
            identifier,
            param: 'ctx'
        };

        const body = this.BlockStatement(ctx.block, context);

        return {
            type: 'functionDeclaration',
            identifier,
            body
        };
    },
    transpile(node) {
        this.emit('function ');
        this.Identifier(node.identifier);
        const context = {
            type: 'functionDeclaration',
            identifier: node.identifier,
            param: 'ctx'
        };
        this.emit(`(${context.param}) {`);
        this.newline();
        this.indent();
        this.BlockStatement(node.body, context);
        this.unindent();
        this.emit('}');
    }
}