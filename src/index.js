import _Edith from './prototype'
import reportRequest from './api/request'
import registBaseEvent from './common/registBaseEvent'
import { getErrorInfo, getCurrentTime, getTimeStamp, getTagName, getSimpleString,
  getXPath, isFunction, setScriptCross, isWhite } from  './common'
import { PROMISE_TIMEOUT, EDITH_STATUS } from './config'
import { tryCatchFn, edithAddEventListener, transToString} from './utils'

class EdithClass extends _Edith {

  silentDev = false // 是否开发环境不上报
  silentPromise = false // 是否需要不监控Promise
  silentWebsocket = false // 是否需要不监控 WebSocket
  silentResource = false // 是否需要不监控资源加载异常
  silentHttp = false // 是否需要不监控网络请求异常
  setHttpBody = false // 是否需要上报post的body
  version = EDITH_VERSION // 版本号

  willMount(options) {
    for(var prop in options){
      if(options[prop] !== void 0 && !isFunction(this[prop]) && prop !== 'version')
        this[prop] = options[prop]
    }
    const tryCatchFunc = fn => tryCatchFn(fn, this)
    this.utils = {
      ...this.utils,
      getCurrentTime,
      getSimpleString,
      tryCatchFunc
    }
    this.filters = options.filters && tryCatchFunc(options.filters)
  }
  didMount() {
    registBaseEvent() // 注册基础事件
  }

  // sleep() {
  //   console.log('sleep')
  // }

  checkSelf() { // 自定义自检方法
    this.handleError({ type: 'error', target: window })
    this.silentResource || this.handleError({ type: 'error', target: {src: '', tagName: 'a', outerHTML: '', parentNode: document} })
    this.silentHttp || this.handleError({ type: 'ajaxError', detail: { target: { url: ''} } })
    this.silentHttp || this.handleError({ type: 'fetchError', detail: { target: {options: {url: ''}} } })
  }

  pluginInstalled() {
    if(this.notListening) return
    setScriptCross()
    // 全局error监听，js报错，包括资源加载报错
    edithAddEventListener('error', this.handleError, true)
    // 全局promise no catch error监听，捕获未处理的promise异常
    // 支持性不太好,IE不支持,低版本浏览器也不支持
    this.silentPromise || edithAddEventListener('unhandledrejection', this.handlePromise)
    // 网络请求的err
    this.silentHttp || edithAddEventListener('ajaxError', this.handleError)
    this.silentHttp || edithAddEventListener('ajaxTimeout', this.handleError)
    this.silentHttp || edithAddEventListener('fetchError', this.handleError)
    this.silentWebsocket || edithAddEventListener('webSocketError', this.handleError)
  }
  
  //  捕获到错误时的回调函数
  handleError = errorEvent => {
    errorEvent = this.errorHandleFunc[errorEvent.type](errorEvent)
    if(!errorEvent) return
    const event = getErrorInfo(errorEvent)
    if(this.life !== EDITH_STATUS.LISTENING) return
    this.setState({
      ...this.state,
      ...event
    }) 
    this.$handleCollect()
  }

  // 处理primise报错，设置了一个修复机制
  handlePromise = (e, pro) => {
    const { tryCatchFunc } = this.utils
    let promiseTimer = setTimeout(tryCatchFunc(() => {
      const { reason } = e
      e.message = Object.prototype.toString.call(reason) === '[object Error]'? reason.toString() : transToString(reason)
      e.name = 'unhandledrejection'
      e._type = 'error'
      const event = getErrorInfo(e)
      this.setState({
        ...this.state,
        ...event
      })
      clearTimeout(promiseTimer)
      this.$handleCollect()
    }), PROMISE_TIMEOUT)
    window.onrejectionhandled = tryCatchFunc((event, promise)=> {
      if(pro !== promise) return
      if(promiseTimer) clearTimeout(promiseTimer)
    })
  }
  debug(name, message) {
    this.setState({
      ...this.state,
      ...getErrorInfo({
        name: transToString(name),
        message: transToString(message),
        timeStamp: getTimeStamp(),
        type: 'customError'
      })
    })
    this.$handleCollect()
  }
  errorHandleFunc = {
    webSocketError : errorEvent => {
      errorEvent.name = 'webSocketError';
      errorEvent._type = 'webSocketError'
      const errorTarget = errorEvent.detail.target || errorEvent.detail.currentTarget;
      const { url, startTime , openTime} = errorTarget
      if(isWhite(this.ajaxWhiteList, url)) return // 白名单不做上报
      errorEvent.extraInfo = {
        url,
        elapsedTime : getCurrentTime() - (openTime || startTime)
      }
      return errorEvent
    },
    resourceError: errorEvent => {
      if(this.silentResource) return
      const errorTarget = errorEvent.target
      // 元素错误，比如引用资源报错，只是普通事件，不是ErrorEvent；html标签的资源报错，暂时不知道发生在哪一行。
      const tagName = getTagName(errorTarget).toLowerCase()
      let sourceUrl = ''
      if(tagName === 'link') {
        sourceUrl = errorTarget.href
      } else sourceUrl = errorTarget.src
      if(isWhite(this.resourceWhiteList, sourceUrl)) return // 白名单不做上报
      sourceUrl.split(/\?|#/)[0] === location.href.split(/\?|#/)[0] && (sourceUrl = '')
      errorEvent.message = sourceUrl
      errorEvent.name = errorEvent._type = 'resourceError'
      errorEvent._target = {
        tagName,
        className: errorTarget.className,
        id: errorTarget.id,
        outerHTML: this.utils.getSimpleString(errorTarget.outerHTML),
        xPath: getXPath(errorTarget)
      }
      return errorEvent
    },
    ajaxError: errorEvent => {
      errorEvent._type = 'httpError'
      errorEvent.name = 'ajaxError'
      const { target: xhr, time } = errorEvent.detail
      const { method, url, startTime, responseText, statusText, status } = xhr
      if(isWhite(this.ajaxWhiteList, url)) return //白名单接口不记录
      errorEvent.extraInfo = {
        elapsedTime: time - startTime,
        responseText,
        status,
        statusText,
        method,
        url
      }
      this.setHttpBody && (errorEvent.extraInfo.body = xhr.body)
      // if(this.httpHeader) {
      //   errorEvent.extraInfo.responseHeader = xhr.getAllResponseHeaders() || {}
      //   errorEvent.extraInfo.requestHeader = requestHeader
      // }
      return errorEvent
    },
    fetchError: errorEvent => {
      const { target: { options }, time } = errorEvent.detail
      // console.log(options)
      if(isWhite(this.ajaxWhiteList, options.url)) return //白名单接口不记录
      errorEvent._type = 'httpError'
      errorEvent.name = errorEvent.message = 'fetchError'
      errorEvent.error = errorEvent.detail
      errorEvent.extraInfo = {
        elapsedTime: time - options.startTime,
        ...options
      }
      if(!this.setHttpBody) delete errorEvent.extraInfo.body
      
      return errorEvent
    },
    error: errorEvent => {
      const errorTarget = errorEvent.target
      if (errorTarget !== window) { // 资源加载错误
        return this.errorHandleFunc['resourceError'](errorEvent)
      }
      return errorEvent
    }
  }

  _changeReportUrl(url) {
    if(!url) return
    this.ajaxWhiteList.push(url)
    this.reportDebug = reportRequest.post(url + '')
  }
}

const Edith = new EdithClass()
export default Edith
