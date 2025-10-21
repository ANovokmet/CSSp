export default {
    type: 'pipeExpression',
    transform(node, ctx) {
        let param, target, argument = '$1';

        return {
            type: 'pipeExpression',
            param,
            target,
            argument
        };
    },
    /* 
    (function(<arg>) {
        <target>
    })(<param>)
    */
    transpile(node) {
        this.emit('(function(');
        this.Node(node.argument);
        this.emit('){');
        this.newline();
        this.indent();
        this.Node(node.target);
        this.newline();
        this.unindent();
        this.emit('})(');
        this.Node(node.param);
        this.emit(')');
    }
}