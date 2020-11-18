# Edith 监控平台script

上报前端错误到Edith后台

[更新日志](./CHANGELOG.md)

---

## 安装

```bash
npm install @inke-design/edith-script -save
```
或者CDN引用，注意可以增加版本号来查看是否有更新版本（- 增量部署的策略限制 -）

```javascript
<script src="https://webcdn.inke.cn/edith.cn/edith.0.2.1.min.js"></script>
```

## 使用方式


** npm方式 **
```javascript
// entry.js

import Edith from '@inke-design/edith-script'

Edith.init({
  apiKey: 'apikey', // 用于区分不同项目
  silentDev: true, // 开发环境下不上报，根据域名是否为ip或者localhost来判断
  plugins: [ // 内置插件
    'breadcrumbs', // 记录用户行为堆栈
    'redo', // 记录录屏
    'network', // 记录网络信息
  ]
})
```

## 其他参数

```javascript
Edith.init({
  apiKey: 'apikey', // 用于区分不同项目，根据域名是否为ip或者localhost来判断
  silentDev: true, // 开发环境下不上报
  plugins: [ // 内置插件，选择引入
    'breadcrumbs', // 记录用户行为堆栈
    'redo', // 记录录屏
    'network', // 记录网络信息
  ],
  resourceWhiteList: ['www.baidu.com', /^((?!(a\.com|b\.com)).)*$/], // 资源加载监听的白名单（支持正则，字符串会忽略判断协议和query参数）
  ajaxWhiteList: ['//example.com/search'], // 网络请求监听的白名单（支持正则，字符串会忽略判断协议和query参数）
  silentPromise: true, // 是否不监听Promise错误，默认为false
  silentResource: true, // 是否不监听资源加载错误，默认为false
  silentHttp: true, // 是否需要不监控网络请求异常，默认为false
  silentWebsocket: true, // 是否不监听Websocket错误，默认为false
  setHttpBody: true, // 是否上报http请求里的body，默认为false
  filters: err => { // 过滤错误函数，参数为带有name, title, url, message, ajax, target的错误信息字段, 返回值为真值，则不上报错误（自定义上报不拦截）
    if(err.message === 'Script error.') return true
  }
})
```

## filters示例
1. 过滤name为 TypeError 的错误

  ```javascript
  Edith.filters = err => {
    if(err.name === 'TypeError') return true
  }

  ```

2. 过滤 method 为 GET，且 status 为 403 的错误

  ```javascript
  Edith.filters = err => {
    if(err.ajax.method === 'GET' && err.ajax.stutus === 403) return true
  }
  ```

3. 过滤指定域名的资源加载错误

  ```javascript
  Edith.filters = err => {
    return err.name === 'resourceError' && err.message.match(/example.com/)
  }
  ```

3. 过滤url为空字符串的图片加载错误

  ```javascript
  Edith.filters = err => {
    const { target: { tagName = '' }, message } = err
    return tagName.match(/img/g) && message === ''
  }
  ```
