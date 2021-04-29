import resolve from 'rollup-plugin-node-resolve'; // 帮助 Rollup 查找外部模块，然后导入
import babel from 'rollup-plugin-babel'; // 让我们可以使用es6新特性来编写代码
import { terser } from 'rollup-plugin-terser'; // 压缩js代码，包括es6代码压缩
import commonjs from 'rollup-plugin-commonjs'; // 将CommonJS模块转换为 ES2015 供 Rollup 处理
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';

export default {
  input: './src/index.js',
  output: [
    { name: 'Vue', file: pkg.main, format: 'cjs', sourcemap: isDev },
    { name: 'Vue', file: pkg.module, format: 'es', sourcemap: isDev },
    { name: 'Vue', file: pkg.browser, format: 'umd', sourcemap: isDev },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true, // 使plugin-transform-runtime生效
    }),
    serve({
      open: true,
      port: 8080,
      contentBase: '',
      openPage: '/index.html',
    }),
    commonjs(),
    resolve(), // 这样 Rollup 能找到 `ms`
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**'],
      exclude: ['node_modules/**'],
    }),
    !isDev && terser(),
  ],
};
