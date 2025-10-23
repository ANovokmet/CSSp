import transformer from './transform';
import transpiler from './transpile';

export function parse(source: string) {
    const ast = transformer.parse(source);
    const target = transpiler.parse(ast);
    return target;
}

export const transform = (src) => transformer.parse(src);
export const transpile = (ast) => transpiler.parse(ast);
