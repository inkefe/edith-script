import _Edith from './prototype'
import registBaseEvent from './common/registBaseEvent'
import { getErrorInfo } from  './common'
import { PROMISE_TIMEOUT, EDITH_STATUS } from './config'
import { tryCatchFunc, edithAddEventListener, getTagName,getOuterHTML,
  getXPath, transToString, isWhite, getTimeStamp } from './utils'


class EdithClass extends _Edith {
  didMount() {
    registBaseEvent() // 注册基础事件
  }

  checkSelf() { // 自定义自检方法
    this.handleError({ type: 'error', target: window })
    this.handleError({ type: 'error', target: {src: '', tagName: 'a', outerHTML: '', parentNode: document} })
    this.handleError({ type: 'ajaxError', detail: { originUrl: '', getAllResponseHeaders() {}} })
    this.handleError({ type: 'fetchError', detail: { options:{url: ''}} })
  }

  pluginInstalled() {
    // 全局error监听，js报错，包括资源加载报错
    edithAddEventListener('error', this.handleError.bind(this), true)
    // 全局promise no catch error监听，捕获未处理的promise异常
    // 支持性不太好,IE不支持,低版本浏览器也不支持
    edithAddEventListener('unhandledrejection', this.handlePromise.bind(this))
    // 网络请求的err
    edithAddEventListener('ajaxError', this.handleError.bind(this))
    edithAddEventListener('ajaxTimeout', this.handleError.bind(this))
    edithAddEventListener('fetchError', this.handleError.bind(this))
  }

  //  捕获到错误时的回调函数
  handleError (errorEvent) {
    errorEvent = this.errorHandleFunc[errorEvent.type](errorEvent)

    const event = getErrorInfo(errorEvent)
    if(this.life !== EDITH_STATUS.LISTENING) return
    this.setState({
      ...this.state,
      ...event
    })
    this.$handleCollect()
  }
  // 处理primise报错，设置了一个修复机制
  handlePromise (e, pro) {
    let promiseTimer = setTimeout(tryCatchFunc(() => {
      const { reason } = e
      e.message = transToString(reason)
      e.name = 'unhandledrejection'
      e._type = 'error'
      const event = getErrorInfo(e)
      this.setState({
        ...this.state,
        ...event
      })
      this.$handleCollect()
    }), PROMISE_TIMEOUT)
    edithAddEventListener('rejectionhandled', tryCatchFunc((event, promise)=> {
      if(pro === promise) {
        if(promiseTimer) clearTimeout(promiseTimer)
        promiseTimer = null
      }
    }))
  }
  debug(name, message) {
    this.setState({
      ...this.state,
      ...getErrorInfo({
        name,
        message,
        timeStamp: getTimeStamp(),
        type: 'customError'
      })
    })
    this.$handleCollect()
  }
  errorHandleFunc = {
    resourceError: errorEvent => {
      const errorTarget = errorEvent.target
      // 元素错误，比如引用资源报错，只是普通事件，不是ErrorEvent；html标签的资源报错，暂时不知道发生在哪一行。
      const tagName = getTagName(errorTarget).toLowerCase()
      let sourceUrl = ''
      if(tagName === 'link') {
        sourceUrl = errorTarget.href
      } else sourceUrl = errorTarget.src
      if(isWhite(this.linkWhiteList, sourceUrl)) return // 白名单不做上报
      errorEvent.message = sourceUrl
      errorEvent.name = errorEvent._type = 'resourceError'
      errorEvent._target = {
        tagName,
        className: errorTarget.className,
        id: errorTarget.id,
        outerHTML: getOuterHTML(errorTarget),
        xPath: getXPath(errorTarget)
      }
      return errorEvent
    },
    ajaxError: errorEvent => {
      errorEvent._type = 'httpError'
      errorEvent.name = 'ajaxError'
      const xhr = errorEvent.detail
      const { method, body, originUrl, startTime, endTime, responseText, statusText, status, requestHeader } = xhr
      if(isWhite(this.ajaxWhiteList, originUrl)) return //白名单接口不记录
      errorEvent.extraInfo = {
        elapsedTime: endTime - startTime,
        requestHeader,
        responseHeader: xhr.getAllResponseHeaders() || {},
        responseText,
        status,
        statusText,
        method,
        body,
        url: originUrl
      }
      return errorEvent
    },
    fetchError: errorEvent => {
      const { options } = errorEvent.detail
      if(isWhite(this.ajaxWhiteList, options.url)) return //白名单接口不记录
      errorEvent._type = 'httpError'
      errorEvent.name = errorEvent.message = 'fetchError'
      errorEvent.error = errorEvent.detail
      errorEvent.extraInfo = {
        elapsedTime: options.endTime - options.startTime,
        ...options
      }
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
}

const Edith = new EdithClass()

window.Edith = Edith
export default Edith
