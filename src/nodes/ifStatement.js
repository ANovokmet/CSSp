export default {
    type: 'ifStatement',
    transform(node, ctx) {
    },
    transpile(node, ctx) {
        this.emit('if(!');
        this.Node(node.test);
        this.emit('){');
        this.newline();
        this.indent();
        this.Node(node.consequent);
        this.newline();
        this.unindent();
        this.emit('}');
    }
}