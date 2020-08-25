import { getCurrentTime, getRandomID, isSuccess, isFunction } from '../utils'
import { eventTrigger } from './index'

// CustomEvent的polyfill
const customEventPolyfill = function () {
  if (isFunction(CustomEvent)) return false;
  function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
  }
  CustomEvent.prototype = Event.prototype;
  window.CustomEvent = CustomEvent;
}

// 封装XMLHttpRequest，为捕获ajax请求增加自定义事件, 以及内部方法封装，以拿到更多参数
// xhr.getAllResponseHeaders()  响应头信息
// xhr.requestHeader            请求头信息
// xhr.responseURL              请求的地址
// xhr.responseText             响应内容
// xhr.originUrl                请求的原始参数地址
// xhr.body                     post参数，（get参数在url上面）
const xhrProxy = function() {
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
          if(eventName === 'loadend') {
            if(!isSuccess(this.status) && !isException) { // 判断状态码,是否是成功的请求,而且不是已经报错了的请求
              eventTrigger.call(this, ajaxEvents['error'])
            }
          }
          isException || (isException = spelEvents.indexOf(eventName) >= 0)
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
  realXHR.send = function(...arg){
    send.apply(realXHR,arg);
    realXHR.body = arg[0];
  }
  // 封装open方法
  const open = realXHR.open;
  realXHR.open = function(...arg){
    open.apply(realXHR,arg)
    realXHR.method = arg[0];
    realXHR.originUrl = arg[1];
    realXHR.async = arg[2];
    realXHR.startTime = getCurrentTime()
    realXHR.endTime = getCurrentTime()
    eventTrigger.call(realXHR, 'ajaxOpen');
  }
  // 封装setRequestHeader方法
  const fn = 'setRequestHeader'
  const setRequestHeader = realXHR[fn]
  realXHR.requestHeader = {};
  realXHR[fn] = function(name, value){
    realXHR.requestHeader[name] = value;
    setRequestHeader.call(realXHR, name, value)
  }

    return realXHR;
  }
  window.XMLHttpRequest = XMLHttpRequest;
}
// 封装fetch
const fetchProxy = function() {
  //拦截原始的fetch方法
  const oldFetchfn = window.fetch; 
  if(!oldFetchfn) return
  window.fetch = function (...args) {
    const now = getCurrentTime()
    const options = {
      url: args[0],
      method: 'GET',
      body: null,
      headers: {},
      status: 0,
      statusText: '',
      startTime: now,
      endTime: now,
      timeStamp: now,
      originUrl: args[0],
      _eid: getRandomID(),
      getAllResponseHeaders: () => ({}),
      ...args[1]
    }
    eventTrigger.call({ options }, 'fetchStart')
    return oldFetchfn.apply(this, args).then(res => {
      res.options = options
      if(!isSuccess(res.status)) { // 判断状态码。是否是成功的请求
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

export default function() {
  customEventPolyfill()
  xhrProxy() // 给XHR注册事件
  fetchProxy() // 给fetch注册事件
}
/**
 * 
//封装WebSocket
;(function() {
  const oldWs = WebSocket; 
  if(!oldWs) return
  const wsEvents = {
    open: 'webSocketOpen',
    error: 'webSocketError',
    close: 'webSocketClose',
  }
  WebSocket = function (url, protocol) {
    const ws = new oldWs(url, protocol);
    const options = {
      url,
      protocol: protocol || ''
    }
    eventTrigger.call({ target: ws }, 'webSocketStart', { options })
    
    Object.keys(wsEvents).forEach(eventName => {
      ws.addEventListener(eventName,
        function (event) {
          eventTrigger.call(event, wsEvents[eventName]);
        }, false);
    })
    return ws
  }
})()

 */
