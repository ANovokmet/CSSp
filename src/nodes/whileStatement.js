module.exports = {
    type: 'whileStatement',
    transform(node, ctx) {
    },
    transpile(node, ctx) {
        this.emit('while(');
        this.Node(node.test);
        this.emit('){');
        this.newline();
        this.indent();
        this.Node(node.body);
        this.newline();
        this.unindent();
        this.emit('}');
    }
}