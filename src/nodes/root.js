class Context {
    constructor(options) {
        this.current = options.head;
        this.block = options.block;
    }
    next() {
        this.current = this.current.next;
        return this.current && this.current.data;
    }
    node() {
        return this.current.data;
    }
}

function getStatementNodes(node) {
    const statements = [];
    
    node.prelude.children.forEach(child => {
        switch (child.type) {
            case 'Selector':
                const expression = getExpression.call(this, child, node.block);
                statements.push(expression);
                break;
            default:
                this.error(child);
        }
    });

    return statements;
}

function getExpression(node, block) {
    let expression;

    const ctx = new Context({ head: node.children.head, block });

    let child = ctx.node();
    switch (child.type) {
        case 'IdSelector':
            // callExpression
            expression = acceptIdSelector.call(this, child, ctx);
            break;
        case 'TypeSelector':
            // identifier
            expression = acceptTypeSelector.call(this, child, ctx);
            break;
        case 'ClassSelector':
            const functionDecl = this.FunctionDeclaration(child, ctx);
            return functionDecl;
            break;
        default:
            this.error(child);
    }

    return {
        type: 'expressionStatement',
        expression
    };
}

function acceptIdSelector(node, ctx) {
    let right = node;

    let next = ctx.next();
    if(!next) {
        return this.CallExpression(node, ctx);
    }

    // assigmentExpression
    if(next.name == '>') { // expect '>'
        next = ctx.next();
        return this.AssignmentExpression({ left: next, right }, ctx);
    }
    
    this.error(node);
}

function acceptTypeSelector(node, ctx) {
    let left = node;

    let next = ctx.next();
    if(!next) {
        return this.AssignmentExpression({ left, right: ctx.block }, ctx);
    }

    if(next.type == 'WhiteSpace') { // expect ' '
        next = ctx.next();
        return this.MemberExpression({ object: left, property: next }, ctx);
    }
    
    this.error(node);
}

module.exports = {
    type: 'root',
    transform(node) {
        const statements = [];

        node.children.forEach(child => {
            switch (child.type) {
                case 'Rule': 
                    // function declaration 
                    // or statement
                    const statement = getStatementNodes.call(this, child);
                    statements.push(...statement);
                    break;
                default:
                    this.error(child);
                    break;
            }
        });

        return {
            type: 'root',
            statements
        };
    },
    transpile(node) {
        node.statements.forEach(child => {
            this.Node(child);
            if(child.type == 'expressionStatement') this.emit(';');
            this.newline(false);
        });
    }
}