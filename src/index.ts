import transformer from './transform';
import transpiler from './transpile';

function parse(source) {
    const ast = transformer.parse(source);
    const target = transpiler.parse(ast);
    return target;
}

const transform = (src) => transformer.parse(src);
const transpile = (ast) => transpiler.parse(ast);

export {
    transform,
    transpile,
    parse
}
