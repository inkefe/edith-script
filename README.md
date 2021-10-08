# Edith 监控平台script

上报前端错误到Edith后台

[更新日志](./CHANGELOG.md)

---

## 开发

[开发请看](./DEVELOPMENT.md)

## 安装

```bash
npm install @inke-design/edith-script -save
```

或者CDN引用，脚本一直会更新到最新版本，不需要更换链接，也支持放在其他域名路径下，[下载cdn源码](https://webcdn.inke.cn/edith.cn/edith.cn.zip)

建议放在`<head>`里，以保证错误和记录数据更加准确

```javascript
<script src="https://webcdn.inke.cn/edith.cn/edith.min.js"></script>
```

## 使用方式

- npm方式

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

- CDN方式

```javascript
window.Edith.init({
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

## 自定义上报方法

在某些情况下，因一些无法跟踪的业务错误，导致业务出现问题，可以采用自定义上报该错误。
Edith内部有一个`debug`方法，可以传两个参数，第一个参数为错误名称(字符串)，第二个参数为错误信息，可以是字符串或者对象等。

  ```javascript
  if(uid === undefined) Edith.debug('NoUID', {
    msg: 'uid为空',
    ...
  })

  ```

## 录屏隐私处理

有些业务，可能由于涉及到隐私和不宜公开的信息，不希望录屏上报到后台，需要给指定的`DOM`做隐私处理。

- 在`HTML`元素中添加类名`.edith-block`将会避免该元素及其子元素被录制，回放时取而代之的是一个同等宽高的占位元素。
- 在`HTML`元素中添加类名`.edith-ignore`将会避免录制该元素的输入事件。
- `input[type="password"]`类型的密码输入框默认不会录制输入事件。

## filters参数示例

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

4. 过滤url为空字符串的图片加载错误

  ```javascript
  Edith.filters = err => {
    const { target: { tagName = '' }, message } = err
    return tagName.match(/img/g) && message === ''
  }
  ```

## 自定义插件

有些业务需要上报业务需要的相关数据，就可以采用自定义插件的方式，本方式参考了`webpack`的插件接入方式

插件是一个带有`apply`方法的对象，这个方法的唯一参数`compiler`为一个函数，需要在`apply`方法内部调用它，来添加上报的插件数据。
> 建议插件内部用`trycatch`捕获**异步函数**的错误，不然可能会导致错误监控和插件执行循环出错的情况

  ```javascript
  Edith.init({
    ...,
    plugins: [
      { // 自定义插件
        apply(compiler) {
          compiler('key', function(edith, callback) {
            callback({
              uid: 'my-data'
            })
          })
        }
      }
    ],
  })
  ```
> 收到上报后，会在后台错误详请里查看插件数据

而这个`compiler`函数，接收两个参数：
1. 第一个为上报插件数据的Key[字符串]
2. 第二个参数为一个获取内容的方法（为了保证每次上报都会执行获取一次），该方法有两个参数
> 第一个为Edith实例对象，可以通过其拿到Edith自身的配置数据；第二个为一个回调函数，通过执行这个函数来传递需要上报的内容，内容可以是对象，也可以是字符串或其他数据类型

除了在初始化时添加插件，也可以动态添加，且可以通过new 一个对象来增加自己需要的属性。
```javascript
 Edith.plugins.push(new MyEdithPlugins(options))
```
