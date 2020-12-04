import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser' // 压缩代码
import replace from '@rollup/plugin-replace'
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs' // 解析ES6的导入导出
// import json from '@rollup/plugin-json' // 解析json
import pkg from './package.json'
const IS_DEV = process.env.NODE_ENV !== 'production'
const format = process.env.FORMAT || 'iife'
const EDITH_VERSION = pkg.version
console.log(EDITH_VERSION)
const plugins = [
  replace({
    IS_DEV: JSON.stringify(IS_DEV),
    FORMAT: JSON.stringify(format),
     EDITH_VERSION: JSON.stringify(EDITH_VERSION),
  }),
  resolve(),
  commonjs(),
  IS_DEV && livereload({
    watch: ['./src', './rollup.config.js', './test/index.html']
  }),
  babel({
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

const external = [  ]
const pluginModule = [
  {
    input: 'src/plugins/RecordPlugin.js',
    output: {
      dir: IS_DEV ? `test/static/plugins_${ EDITH_VERSION}` : `dist/plugins_${ EDITH_VERSION}`,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
    },
    external,
    plugins
  },
  {
    input: 'src/plugins/BreadcrumbsPlugin.js',
    output: {
      dir: IS_DEV ? `test/static/plugins_${ EDITH_VERSION}` : `dist/plugins_${ EDITH_VERSION}`,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
    },
    external,
    plugins
  },
  {
    input: 'src/plugins/NetworkCheckPlugin.js',
    output: {
      dir: IS_DEV ? `test/static/plugins_${ EDITH_VERSION}` : `dist/plugins_${ EDITH_VERSION}`,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
    },
    external,
    plugins
  }
]

let rollupConfig = [
  {
    input: 'src/index.js',
    output: {
      dir: IS_DEV ? 'test/static' : format === 'iife' ? void 0 : 'lib',
      file: IS_DEV ? void 0 : format === 'iife' ? `dist/edith.${ EDITH_VERSION}.min.js` : void 0,
      format, // 打包的类型格式，amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体）
      // name: 'Edith',
      // exports: 'named'
    },
    external,
    plugins
  }
]
if(format === 'iife') rollupConfig = [...rollupConfig, ...pluginModule]

export default rollupConfig
