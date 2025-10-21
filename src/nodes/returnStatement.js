export default {
    type: 'returnStatement',
    transform(node, ctx) {
        return {
            type: 'returnStatement',
            argument: ctx.param
        };
    },
    transpile(node, ctx) {
        this.emit(`return ${node.argument}`);
    }
}