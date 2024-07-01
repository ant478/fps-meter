import path from 'path';
import sass from 'node-sass';
import { babel } from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';

const paths = require('./paths');

const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  input: paths.entry,
  output: {
    file: path.resolve(paths.dist, 'index.js'),
    sourcemap: true,
    format: 'umd'
  },
  plugins: [
    del({ targets: paths.dist }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
      sourceMap: false
    }),
    babel({
      babelHelpers: 'runtime'
    }),
    postcss({
      preprocessor: (content, id) => new Promise((resolve) => {
        const result = sass.renderSync({ file: id });
        resolve({ code: result.css.toString() });
      }),
      plugins: [
        postcssPresetEnv()
      ],
      sourceMap: false,
      minimize: !isDevelopment,
      inject: false,
      extract: false
    }),
    !isDevelopment && terser()
  ]
};
