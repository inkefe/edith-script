import { getCurrentTime, getRandomID, isSuccess, isFunction } from '../utils' // , getLocalData, saveLocalData
import { eventTrigger } from './index'
// import { getCLS, getFID, getLCP, getFCP } from 'web-vitals';
import { loadScript } from '../utils' // getPerform
// import { reportDebug } from '../api'

// CustomEvent的polyfill
const customEventPolyfill = function () {
  if (isFunction(CustomEvent)) return false;
  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = Event.prototype;
  window.CustomEvent = CustomEvent;
}

// 封装XMLHttpRequest，为捕获ajax请求增加自定义事件, 以及内部方法封装，以拿到更多参数
// xhr.getAllResponseHeaders()  响应头信息
// xhr.requestHeader            请求头信息
// xhr.responseText             响应内容
// xhr.url                请求的地址
// xhr.body                     post参数，（get参数在url上面）
const xhrProxy = function () {
  const ajaxEvents = {
    abort: 'ajaxAbort', // 请求中止
    error: 'ajaxError', // 请求错误
    // load: 'ajaxLoad', // 请求加载
    // loadstart: 'ajaxLoadStart', // 请求加载开始
    progress: 'ajaxProgress', // 请求中
    timeout: 'ajaxTimeout', // 请求超时事件
    loadend: 'ajaxLoadEnd', // 请求加载结束
    // readystatechange: 'ajaxReadyStateChange', // 请求状态变化
  }
  // const uploadEvents = { // 上传事件
  //   loadstart: 'uploadStart', // 请求加载开始
  //   progress: 'uploadProgress', // 请求中
  //   load: 'upload', // 请求加载
  //   loadend: 'uploadEnd', // 请求加载结束
  // }
   
  const XHR = window.XMLHttpRequest;
  const spelEvents = ['error', 'timeout', 'abort']
  function XMLHttpRequest() {
    var realXHR = new XHR();
    let isException = false
    Object.keys(ajaxEvents).forEach(eventName => {
      realXHR.addEventListener(eventName,
        function (e) {
          eventTrigger.call(this, ajaxEvents[eventName]);
          isException || (isException = spelEvents.indexOf(eventName) >= 0)
          if (eventName === 'loadend') {
            if (!isSuccess(this.status) && !isException) { // 判断状态码,是否是成功的请求,而且不是已经报错了的请求
              eventTrigger.call(this, ajaxEvents['error'])
            }
          }
        }, false);
    })
    // Object.keys(uploadEvents).forEach(eventName => {
    //   realXHR.upload.addEventListener(eventName,
    //     function () {
    //       eventTrigger.call(this, uploadEvents[eventName]);
    //     }, false);
    // })

    // 封装send方法
    const send = realXHR.send;
    realXHR.send = function (...arg) {
      send.apply(realXHR, arg);
      realXHR.body = arg[0];
    }
    // 封装open方法
    const open = realXHR.open;
    realXHR.open = function (...arg) {
      realXHR.method = arg[0]
      realXHR.url = arg[1]
      realXHR.async = arg[2]
      realXHR.startTime = getCurrentTime() // startTime必须以绝对时间来计算
      eventTrigger.call(realXHR, 'ajaxOpen')
      open.apply(realXHR, arg)
    }
    // 封装setRequestHeader方法
    // const fn = 'setRequestHeader'
    // const setRequestHeader = realXHR[fn]
    // realXHR.requestHeader = {};
    // realXHR[fn] = function (name, value) {
    //   realXHR.requestHeader[name] = value;
    //   setRequestHeader.call(realXHR, name, value)
    // }

    return realXHR;
  }
  window.XMLHttpRequest = XMLHttpRequest;
}
// 封装fetch
const fetchProxy = function () {
  //拦截原始的fetch方法
  const oldFetchfn = window.fetch;
  if (!oldFetchfn) return
  window.fetch = function (arg, opt) {
    const now = getCurrentTime()
    let options = {
      startTime: now,
      status: 0,
      body: null,
      statusText: '',
      // getAllResponseHeaders: () => ({}),
      _eid: getRandomID(),
    }
    if(window.Request && arg instanceof window.Request) {
      const { url, method, body } = arg // , headers: getHeaders(headers)
      options = { ...options, url, method, body,  }
    } else options = {
      url: arg,
      method: 'GET',
      ...options,
      ...opt,
      // headers: getHeaders(opt.headers),
    }
    
    eventTrigger.call({ options }, 'fetchStart')
    return oldFetchfn.apply(this, [arg, opt]).then(res => {
      res.options = options
      if (!isSuccess(res.status)) { // 判断状态码。是否是成功的请求
        eventTrigger.call({ options }, 'fetchError')
      }
      eventTrigger.call({ options }, 'fetchEnd')
      return res
    }, err => {
      err.options = options
      eventTrigger.call({ options }, 'fetchError')
    })
  }
}
/*
// 性能监控以及埋点
function performanceRecode () {
  const page = location.pathname
  let performanceData = JSON.parse(JSON.stringify(getPerform()))
  if (!performanceData) return;
  const oldPerformanceData = getLocalData('performance') || {}
  let havePage = false;
  let currentDate = new Date().toLocaleDateString();
  Object.keys(oldPerformanceData).forEach(item => {
    if (item !== page) return
    let oldData = oldPerformanceData[item]
    // 如果时间相同就不上报改为求平均值
    if (currentDate === oldData.currentDate) {
      // 计算当日打开次数
      performanceData.count = oldData.count + 1
      for (var key in performanceData.timing) {
        performanceData.timing[key] = (oldData.timing[key] * oldData.count + performanceData.timing[key]) / performanceData.count
      }
      performanceData.currentDate = currentDate
      oldPerformanceData[item] = {
        ...oldPerformanceData[item],
        ...performanceData
      }
    } else {
      reportDebug(oldData)
      oldPerformanceData[item] = {
        ...oldPerformanceData[item],
        ...performanceData,
        count: 1,
        currentDate,
      }
    }
    havePage = true
  })
  if (!havePage) {
    oldPerformanceData[page] = {
      ...performanceData,
      count: 1,
      currentDate,
    }
  }
  saveLocalData('performance', oldPerformanceData)
  // 累计位移偏移，CLS（Cumulative Layout Shift），记录了页面上非预期的位移波动。
  // getCLS(setToPageStorage('CLS', page));
  // 首次输入延迟，FID（First Input Delay），记录在 FCP 和 TTI 之间用户首次与页面交互时响应的延迟。
  // getFID(setToPageStorage('FID', page));
  // 最大内容绘制，LCP（Largest Contentful Paint），
  // getLCP(setToPageStorage('LCP', page));
  // 首次内容绘制，FCP（First Contentful Paint），这个指标用于记录页面首次绘制文本、图片、非空白 Canvas 或 SVG 的时间。
  // getFCP(setToPageStorage('FCP', page))
}

function setToPageStorage (type, page) {
  return function (message) {
    const performanceData = getLocalData('performance')
    Object.keys(performanceData).forEach(item => {
      if (item === page) {
        performanceData[item][type] = (message.value + performanceData[item][type] * (performanceData[item].count - 1)) / performanceData[item].count
      }
    })
    saveLocalData('performance', performanceData)
  }
}
*/

function promisePolyfill () {
  if(window.Promise) return
  loadScript('//webcdn.inke.cn/tpc/common/es6-promise/3.2.2/es6-promise.min.js', () => {
    eventTrigger.call(this, 'promisePolyfill')
  })
}

promisePolyfill()
export default function () {
  customEventPolyfill()
  xhrProxy() // 给XHR注册事件
  fetchProxy() // 给fetch注册事件
  // performanceRecode()
}

//封装WebSocket
(function() {
  const oldWs = WebSocket; 
  if(!oldWs) return
  const wsEvents = {
    open: 'webSocketOpen',
    error: 'webSocketError',
    close: 'webSocketClose',
  }
  WebSocket = function (url, protocol) {
    const ws = new oldWs(url, protocol);
    ws.startTime = getCurrentTime()
    eventTrigger.call(ws, 'webSocketStart')
    
    Object.keys(wsEvents).forEach(eventName => {
      ws.addEventListener(eventName,
        function (e) {
          eventTrigger.call(this, wsEvents[eventName]);
        }, false);
    })
    return ws
  }
})()


