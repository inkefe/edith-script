import resolve from 'rollup-plugin-node-resolve'
import { babel } from '@rollup/plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser' // 压缩代码
import replace from '@rollup/plugin-replace'
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import cleaner from 'rollup-plugin-cleaner'
import commonjs from '@rollup/plugin-commonjs' // 解析ES6的导入导出
// import json from '@rollup/plugin-json' // 解析json
import pkg from './package.json'


const IS_DEV = process.env.NODE_ENV !== 'production'
const format = process.env.FORMAT || 'iife'

const plugins = [
  !IS_DEV && format !== 'iife' && cleaner({
    targets: [ './lib' ]
  }),
  replace({
    preventAssignment: true,
    IS_DEV: JSON.stringify(IS_DEV),
    FORMAT: JSON.stringify(format),
    EDITH_VERSION: JSON.stringify(pkg.version),
  }),
  resolve(),
  commonjs(),
  IS_DEV && livereload({
    watch: ['./src', './rollup.config.js', './test/index.html']
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**'
  }),
  !IS_DEV && terser(),
  eslint(),
  // 本地服务器
  IS_DEV && serve({
    open: true, // 自动打开页面
    port: 7000,
    openPage: '/index.html', // 打开的页面
    contentBase: 'test'
  })
]

const pluginModule = [
  {
    input: 'src/plugins/RecordPlugin.js',
    output: {
      name: 'Edith.RecordPlugin',
      dir: IS_DEV ? `test/static/plugins` : `dist/plugins`,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
    },
    plugins
  },
  {
    input: 'src/plugins/BreadcrumbsPlugin.js',
    output: {
      name: 'Edith.BreadcrumbsPlugin',
      dir: IS_DEV ? `test/static/plugins` : `dist/plugins`,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
    },
    plugins
  },
  {
    input: 'src/plugins/NetworkCheckPlugin.js',
    output: {
      name: 'Edith.NetworkCheckPlugin',
      dir: IS_DEV ? `test/static/plugins` : `dist/plugins`,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
    },
    plugins
  }
]

let rollupConfig = [
  {
    input: 'src/index.js',
    output: {
      dir: IS_DEV ? 'test/static' : format === 'iife' ? void 0 : 'lib',
      file: !IS_DEV && format === 'iife' ? `dist/edith.min.js` : void 0,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
      name: 'Edith',
      // exports: 'named'
    },
    plugins
  }
]
if(format === 'iife') rollupConfig = [...rollupConfig, ...pluginModule]

export default rollupConfig
