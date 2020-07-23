const transformer = require('./transform');
const transpiler = require('./transpile');

function parse(source) {
    const ast = transformer.parse(source);
    const target = transpiler.parse(ast);
    return target;
}

module.exports = {
    parse
}