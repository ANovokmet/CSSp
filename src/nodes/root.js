class Context {
    constructor(options) {
        this.current = options.head;
        this.block = options.block;
        this.argId = 0;
    }
    next() {
        this.current = this.current.next;
        return this.current && this.current.data;
    }
    node() {
        return this.current && this.current.data;
    }
    getArg() {
        return `$${this.argId++}`
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
    const ctx = new Context({ head: node.children.head, block });
    let next = ctx.node();

    switch (next.type) {
        case 'IdSelector':
        case 'TypeSelector':
            const arg = ctx.getArg();
            const target = pipeExpr.call(this, ctx, arg);
            const param = this.ObjectExpression(block, ctx);
            const argument = this.Identifier(arg);
            return {
                type: 'expressionStatement',
                expression: buildPipeExpr(param, target, argument)
            }
            break;
        case 'ClassSelector':
            const functionDecl = this.FunctionDeclaration(next, ctx);
            return functionDecl;
            break;
        default:
            this.error(child);
    }
}

function buildPipeExpr(param, target, argument) {
    return {
        type: 'pipeExpression',
        argument,
        target: {
            type: 'expressionStatement',
            expression: target
        },
        param
    };
}

function pipeExpr(ctx, arg) {
    let left = memberExp.call(this, ctx, arg);

    if (left.type != 'callExpression') {
        left = {
            type: 'assignmentExpression',
            operator: '=',
            left,
            right: this.Identifier(arg)
        }
    }

    left = ifExpr.call(this, ctx, arg, left);
    return left;
}

function memberExp(ctx, arg) {
    let curr = ctx.node();
    let left = identifierExpr.call(this, ctx, arg);
    if (curr.type == 'IdSelector') {
        left = {
            type: 'callExpression',
            callee: left,
            argument: this.Identifier(arg)
        }
    }
    let right = memberExp$.call(this, ctx, arg, left);
    return right;
}

function memberExp$(ctx, arg, child) {
    let curr = ctx.node();
    if (curr && curr.type == 'WhiteSpace') {
        curr = ctx.next();
        const right = identifierExpr.call(this, ctx, arg);

        let left = {
            type: 'memberExpression',
            object: child,
            property: right
        };
        if (curr.type == 'IdSelector') {
            left = {
                type: 'callExpression',
                callee: left,
                argument: this.Identifier(arg)
            }
        } else if (curr.type != 'TypeSelector') {
            throw new Error();
        }

        return memberExp$.call(this, ctx, arg, left);
    } else {
        return child;
    }
}

function ifExpr(ctx, arg, child) {
    let curr = ctx.node();
    if (curr && curr.type == 'PseudoClassSelector' && curr.name == 'not') {
        const childCtx = new Context({ head: curr.children.head.data.children.head.data.children.head });
        const test = memberExp.call(this, childCtx, arg);

        ctx.next();
        const ch = ifExpr.call(this, ctx, arg, child);
        return {
            type: 'ifStatement',
            test,
            consequent: ch,
        };
    }
    else if (curr && curr.type == 'PseudoClassSelector' && curr.name == 'matches') {
        const childCtx = new Context({ head: curr.children.head.data.children.head.data.children.head });
        const test = memberExp.call(this, childCtx, arg);

        ctx.next();
        const ch = ifExpr.call(this, ctx, arg, child);
        return {
            type: 'whileStatement',
            test,
            body: ch,
        };
    } else if (curr && curr.name == '>') {
        ctx.next();
        const argument = this.Identifier(ctx.getArg());
        const right = pipeExpr.call(this, ctx, argument);
        return buildPipeExpr(child, right, argument);
    }
    return child;
}

function identifierExpr(ctx) {
    const next = ctx.node();
    ctx.next();
    switch (next.type) {
        case 'IdSelector':
        case 'TypeSelector':
            return this.Identifier(next);
        default:
            this.error(next);
    }
}

/*
pipeExpr -> callExpr (">" pipeExpr)     
callExpr -> (memberExpr) <IdSelector>
memberExpr -> memberExpr " " <Identifier> | <Identifier>

memberExpr -> <Identifier> memberExpr'
memberExpr' -> " " <Identifier> memberExpr' | <empty>

*/


/*
pipeExpr -> callExpr | memberExpr (">" pipeExpr)    

memberExpr -> <Identifier> memberExpr'
memberExpr' -> " " <Identifier> memberExpr' | <empty>

*/
export default {
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
            this.newline(false);
        });
    }
}