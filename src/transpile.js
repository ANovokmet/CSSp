const nodeSettings = require('./nodes');
const { loop_guard } = require('./runtime/types');

const transpiler = {
    parse(ast, options = {}) {
        this.guardLoops = options.guardLoops !== undefined ? options.guardLoops : true;
        this.buffer = '';
        this.whitespace = '';
        this.runtimeBuffer = '';
        this.hasLoopGuard = false;

        switch (ast.type) {
            case 'root':
                this.Root(ast);
                break;
            default:
                this.error(ast);
                break;
        }

        if(this.runtimeBuffer) {
            this.newline();
            this.emit(this.runtimeBuffer);
        }
        return this.buffer;
    },
    emit(token) {
        this.buffer += token;
    },
    newline(tab = true) {
        this.buffer += '\n'
        if(tab)
            this.buffer += this.whitespace;
    },
    indent() {
        this.whitespace += '  ';
        this.buffer += '  ';
    },
    unindent() {
        this.whitespace = this.whitespace.substring(0, this.whitespace.length - 2);
        this.buffer = this.buffer.substring(0, this.buffer.length - 2);
    },
    error(node) {
        throw new Error(`This.error transpiling ${node.type} node`, node);
    },
    Node(node) {
        if(node && this.nodes.has(node.type)) {
            this.nodes.get(node.type).call(this, node);
        } else {
            this.error(node);
        }
    },
    includeLoopGuard() {
        if(!this.hasLoopGuard) {
            this.hasLoopGuard = true;
            this.runtimeBuffer += loop_guard.toString();
        }
    }
}

transpiler.nodes = new Map();
for(const key in nodeSettings) {
    const node = nodeSettings[key];
    transpiler.nodes.set(node.type, node.transpile);
    transpiler[key] = node.transpile;
}

module.exports = transpiler;