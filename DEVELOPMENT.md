
### 项目启动
运行`npm run dev`，浏览器会自动打开http://localhost:7000

### 打包

- cdn打包
运行`npm run build`

- npm打包
运行`npm run build:es`

## 部署到npm

> 升级后警告过时的包 `npm deprecate @inke-design/edith-script@xxx '该版本已过期，请及时升到最新的脚本版本,体验更好的功能，npm install @inke-design/edith-script@latest'`

- `npm login`
- `npm publish --access public`

> 撤销包`npm unpublish @inke-design/edith-script@xxx`；

<!-- 升级
cp ./dist/edith.min.js ./dist/edith.0.3.1.min.js
cp ./dist/edith.min.js ./dist/edith.0.3.0.min.js
cp ./dist/edith.min.js ./dist/edith.0.2.8.min.js
cp ./dist/edith.min.js ./dist/edith.0.2.7.min.js
cp ./dist/edith.min.js ./dist/edith.0.2.5.min.js
-->
