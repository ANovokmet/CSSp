module.exports = {
    type: 'whileStatement',
    transform(node, ctx) {
    },
    transpile(node, ctx) {
        if(this.guardLoops) {
            this.includeLoopGuard();
            this.emit('const $g = loop_guard(100);');
            this.newline();
        }
        this.emit('while(');
        this.Node(node.test);
        this.emit('){');
        this.newline();
        this.indent();
        if(this.guardLoops) {
            this.emit('$g();');
            this.newline();
        }
        this.Node(node.body);
        this.newline();
        this.unindent();
        this.emit('}');
    }
}