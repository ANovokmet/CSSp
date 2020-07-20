module.exports = {
    type: 'literal',
    transform(node) {
        const value = node.value;

        return {
            type: 'literal',
            value
        };
    },
    transpile(node) {
        this.emit(node.value);
    }
}