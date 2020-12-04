const ua = navigator.userAgent
const referrer = document.referrer
// 自定义事件触发的公共方法
export const eventTrigger = function (event) {
  window.dispatchEvent(new CustomEvent(event, { detail: this }));
}
// 组合 参数
export const getErrorInfo = err => {
  return {
    type: err._type || err.type, // 错误的类型，如httpError
    name: (err.name || err.message && err.message.split(':')[0] || err.type).replace(/^Uncaught\s/, ''), // 错误信息的名称
    message: err.message || err.description || '', // 错误信息的内容
    extraInfo: err.extraInfo || null,
    stacktrace: err.error && err.error.stack, // 错误的执行栈
    target: err._target,
    timeStamp: ~~err.timeStamp,
    title: document.title, // 报错页面的标题
    referrer, // 从哪个页面跳转过来
    url: location.href,
    userAgent: ua,
    columnNumber: err.colno,
    lineNumber: err.lineno,
    cookie: document.cookie,
    version: window.Edith.version, // Edith版本号
    // performance: getPerform(),
    // locale: navigator.browserLanguage || navigator.language,
    // severity: err.severity,

    // notifierVersion: '1.0.0', // 通知的版本号
    // revideoVersion: '', // 回放插件的版本号 
    // releaseStage: '', // 错误发生的环境，production| development
    // time: +new Date(), // 错误发生的时间戳
  }
}


