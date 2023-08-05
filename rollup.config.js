import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser';

const plugins = [
    typescript({
        typescript: require('typescript'),
    }),
    nodeResolve(),
    commonjs(),
    terser(),
];

export default [{
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/fetch-stream-observable.min.js',
            format: 'umd',
            name: 'fetchObservable',
        },
    ],
    plugins,
}];