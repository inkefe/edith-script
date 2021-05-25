// http://testevent-edith.op-center.cn
export const serviceRoot = IS_DEV ? 'http://testevent-edith.op-center.cn' : 'https://event-edith.op-center.cn'

// 存储用户行为的本地数据key
export const RECORD_KEY = '_edith_record'

// Promise多久未被处理后报错(ms)
export const PROMISE_TIMEOUT = 500
 // 默认请求白名单，不记录不报错
const ajaxWhiteList = [
  `${serviceRoot}/v1/monitor/add`, 
  `${serviceRoot}/v1/upload/test-img`,
    /\/sockjs-node\/info/, // 忽略代理报错
]

// 状态
export const EDITH_STATUS = {
  INIT: 'INIT', // init阶段
  WILL_MOUNT: 'WILL_MOUNT', // 即将mount阶段 （自检，安装插件）
  DID_MOUNT: 'DID_MOUNT', // mounted阶段
  CHECK_SELF: 'CHECK_SELF', // 自检
  INSTALL_PLUGIN: 'INSTALL_PLUGIN', // 安装插件
  LISTENING: 'LISTENING', // 错误监听中
  COLLECTING: 'COLLECTING', // 错误收集中
  SLEEP: 'SLEEP' // 不监听事件和上传
}

// 内置插件
export const innerPlugins = {
  breadcrumbs: () => import('../plugins/BreadcrumbsPlugin'),
  network: () => import('../plugins/NetworkCheckPlugin'),
  redo: () => import('../plugins/RecordPlugin')
}
const scriptPath = () => {
  const url = document.currentScript.src
  const link = document.createElement('a')
  link.href = url
  const path = (`${link.hostname}${link.port ?  ':' + link.port : ''}${link.pathname}`).replace(/\/[^/]+$/, '')
  return path
}
const cdnPath = `//${scriptPath() || 'webcdn.inke.cn/edith.cn'}`

// 内置插件的cdn地址
export const innerPluginsCdn = {
  breadcrumbs: {
    link: `${cdnPath}/plugins/BreadcrumbsPlugin.js`,
    name: 'BreadcrumbsPlugin'
  },
  network: {
    link: `${cdnPath}/plugins/NetworkCheckPlugin.js`,
    name: 'NetworkCheckPlugin'
  } ,
  redo: {
    link: `${cdnPath}/plugins/RecordPlugin.js`,
    name: 'RecordPlugin'
  }
}
export const remixProps = {
  ajaxWhiteList, 
  resourceWhiteList: [
    ...Object.keys(innerPluginsCdn).map(item => innerPluginsCdn[item].link),
    '//webcdn.inke.cn/edith.cn/hm.gif']
}
