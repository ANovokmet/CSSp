const fs = require('fs');

const buf = fs.readFileSync('./samples/combinators.css');
const content = buf.toString();

const transformer = require('./src/transform');
const cssp_ast = transformer.parse(content);

const transpiler = require('./src/transpile');
const cssp_runtime = transpiler.parse(cssp_ast);

console.log(cssp_runtime);