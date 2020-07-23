import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default [
    {
        input: 'src/index.js',
        output: {
            name: 'CSSp',
            file: "docs/cssp.js",
            format: 'umd'
        },
        plugins: [
            json(), 
            resolve(),
            commonjs()
        ]
    },
    // {
    // 	input: 'src/index.js',
    // 	output: [
    // 		{ file: "public/cssp.js", format: 'cjs' },
    // 		{ file: pkg.module, format: 'es' }
    // 	]
    // }
];