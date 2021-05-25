import { measureBWSimple } from '../api'
import { getCurrentTime, tryCatchFunc, getTimeStamp } from '../utils'

const ua = navigator.userAgent
const referrer = document.referrer
// 自定义事件触发的公共方法
export const eventTrigger = function (event) {
  window.dispatchEvent(new CustomEvent(event, { detail: { target: this, time: getCurrentTime() } }));
}
// 组合 参数
export const getErrorInfo = err => {
  return {
    type: err._type || err.type, // 错误的类型，如httpError
    name: (err.name || err.message && err.message.split(':')[0] || err.type)?.replace(/^Uncaught\s/, ''), // 错误信息的名称
    message: err.message || err.description || '', // 错误信息的内容
    extraInfo: err.extraInfo || null,
    stacktrace: err.error && err.error.stack, // 错误的执行栈
    target: err._target,
    timeStamp: getTimeStamp(),
    title: document.title, // 报错页面的标题
    referrer, // 从哪个页面跳转过来
    url: location.href,
    userAgent: ua,
    columnNumber: err.colno,
    lineNumber: err.lineno,
    cookie: document.cookie,
    version: EDITH_VERSION, // Edith版本号
    // performance: getPerform(),
    // locale: navigator.browserLanguage || navigator.language,
    // severity: err.severity,

    // notifierVersion: '1.0.0', // 通知的版本号
    // revideoVersion: '', // 回放插件的版本号 
    // releaseStage: '', // 错误发生的环境，production| development
    // time: +new Date(), // 错误发生的时间戳
  }
}

// 通过发起http请求，测试网络速度, 定时调用回调，参数为单位为KB/sec的数值
export const measureBW = (fn, time) => {
  const test = n => {
    const startTime = getCurrentTime();
    measureBWSimple({ t : Math.random() }).then(res => {
      const fileSize = res.length
      const endTime = getCurrentTime();
      var speed = fileSize / ((endTime - startTime)/1000) / 1024;
      fn && n && fn(Math.floor(speed));
      if(n >= time) return
      test(++n)
    }).catch(e => {}) 
  }
  test(0)
}

// 事件阻止
const eventPresent = (e) => {
  if (!e) return
  const func = ['preventDefault', 'stopPropagation']
  func.forEach((item) => e[item] && e[item]())
  e.cancelBubble = true
}

// 获取延迟,通过js加载一张1x1的极小图片，来测试图片加载的所用的时长
export const measureDelay = (fn, count) => {
  count = count || 1
  let n = 0
  const src = '//webcdn.inke.cn/edith.cn/hm.gif?'
  const ld = () => {
      const t = getCurrentTime(), img = new Image;
      img.onload = () => {
          const tcp = getCurrentTime() - t
          n++
          fn(tcp) // 存储延迟回调
          if(n < count) setTimeout(ld, 1000)
      }
    img.src = src + Math.random()
    img.onerror = tryCatchFunc(eventPresent)
  }
  const img_start = new Image()
  img_start.onerror = tryCatchFunc(eventPresent)
  img_start.onload = ld
  img_start.src = src + Math.random()
}
