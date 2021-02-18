import { getTagName, edithAddEventListener, getRandomID, getXPath,
  isIE8, getOuterHTML, getCurrentTime, getTimeStamp, isWhite } from '../utils'
import { eventTrigger } from '../common'

// 用户行为记录的最多数量
const RECORD_COUNT = 20
let ajaxWhiteList = []
const navigationProxy = () => {
  if(!history.replaceState && history.pushState ) return
  function proxyState (prop, fn) {
    return function(...arg){
      arg[2] && fn && eventTrigger.call({
        oldURL: location.href,
        newURL: arg[2],
        method: prop,
      }, 'navigationChange');  
      return fn.apply(this, arg);
    }
  }
  // 封装history.pushState
  history.pushState = proxyState('pushState', history['pushState'])
  // 封装history.replaceState
  history.replaceState = proxyState('replaceState', history['replaceState'])
}

const breadcrumbs = [] 
// 自定义add方法来添加数据，并且超过数量限制后自动会移除最早的记录,同时支持根据唯一id，选择覆盖还是添加操作
breadcrumbs.add = data => {
  const index = breadcrumbs.findIndex(i => data.eid && i.eid === data.eid) // 如果有相同的eid，代表只需要修改
  if(index >= 0) return breadcrumbs.splice(index, 1, {...breadcrumbs[index], ...data})
  if(breadcrumbs.length >= RECORD_COUNT) breadcrumbs.shift()
  breadcrumbs.push({
    eid: getRandomID(),
    ...data
  })
}
/**
 * 用户交互行为记录监控
 */
const addActionRecord = type => event => {
  // 记录用户点击元素的行为数据
  const errorTarget = event.target; // target支持性好
  const tagName = getTagName(errorTarget).toLowerCase()
  const className = errorTarget.className;
  const id = errorTarget.id;
  const outerHTML = getOuterHTML(errorTarget)
  const record = {
    type,
    time: getCurrentTime(),
    timeStamp: event.timeStamp, 
    // page: {
    //   url: location.href,
    //   title: document.title
    // },
    detail: {
      className,
      id,
      outerHTML,
      tagName,
      xPath: getXPath(errorTarget)
    }
  }
  breadcrumbs.add(record)
};

const addUrlRecord = method => event => {
  const record = {
    type: 'navigation',
    time: getCurrentTime(),
    method: method || event.detail.method,
    timeStamp: event.timeStamp,
    detail: {
      from: {
        url: event.oldURL || event.detail.oldURL,
        title: document.title
      },
      to: {
        url: event.newURL || event.detail.newURL,
      }
    }
  }
  breadcrumbs.add(record)
}


/**
 * 添加http请求记录监控，包括fetch
 */
const addHttpRecord = (xhr, type = 'XMLHttpRequest') => {
  const { method, status, statusText, responseURL, url, body = null,
    endTime, _eid, timeStamp, startTime } = xhr
  const elapsedTime = endTime - startTime // 请求耗时
  if(isWhite(ajaxWhiteList, url)) return //白名单接口不记录
  const record = {
    eid: _eid,
    type,
    time: startTime,
    timeStamp,
    // page: {
    //   url: location.href,
    //   title: document.title
    // },
    elapsedTime,
    detail: {
      method, // 请求方法
      status, // 状态码
      body, // post请求的body
      // requestHeader,
      // responseHeader: xhr.getAllResponseHeaders() || {}, // 这个方法不能解构出来赋值
      statusText, // 状态
      url: responseURL || url, // 接口响应地址
    }
  }
  breadcrumbs.add(record)
}

// 记录ajax请求
const recordAjax = () => {
  const callBack = e => {
    const { target: xhr, time } = e.detail
    xhr._eid = xhr._eid || getRandomID()
    xhr.timeStamp = xhr.timeStamp || e.timeStamp
    xhr.endTime = time // 不断更新状态
    addHttpRecord(xhr)
  }
  edithAddEventListener('ajaxOpen', callBack)
  edithAddEventListener('ajaxProgress', callBack);
  // 当XHR发生 abort / timeout / error 时事件触，loadend是最后触发的
  edithAddEventListener('ajaxLoadEnd', callBack);
}
// getAllResponseHeaders没有
const recordFetch = () => {
  const callBack = e => {
    const { target: { options }, time } = e.detail
    options.timeStamp = options.timeStamp || e.timeStamp
    const xhr = {
      ...options,
      ...e.detail,
      endTime: time,
      // requestHeader: options.headers
    }
    addHttpRecord(xhr, 'fetchRequest')
  }
  edithAddEventListener('fetchStart', callBack);
  edithAddEventListener('fetchEnd', callBack);
}

const addWebSocketRecord = method => ws => {
  const { _eid: eid, time, elapsedTime, url, readyState, timeStamp } = ws
  const record = {
    eid,
    type: 'webSocket',
    time,
    timeStamp,
    method,
    elapsedTime, // 建立连接耗时
    detail: {
      url,
      readyState,
    }
  }
  breadcrumbs.add(record)
}

// 记录WebSocket，建立连接和断开，算两次不同的行为记录
const recordWebSocket = () => {
  const callback = (type, isStart) => e => {
    const { target: ws, time } = e.detail
    const isOpen = type === 'open'
    ws._eid = isOpen && !isStart && ws._eid ? ws._eid : getRandomID()
    ws.openTime = ws.openTime || (isStart ? 0 : time )

    ws.time = isOpen ? (ws.time || time) : time
    ws.startTime = isStart ? time : ws.startTime
    ws.elapsedTime = isOpen
      ? time - ws.startTime
      : time - (ws.openTime || ws.startTime)

    ws.timeStamp = ws.timeStamp || e.timeStamp
    addWebSocketRecord(type)(ws)
  }
  edithAddEventListener('webSocketStart', callback('open', true))
  edithAddEventListener('webSocketOpen', callback('open'))
  edithAddEventListener('webSocketClose', callback('close'))
}

const behaviorRecord = () => {
  edithAddEventListener('click', addActionRecord('click'), true)
  recordAjax()
  recordFetch()
  recordWebSocket() // 监听webSocket
  if(isIE8) {
    let url = location.href
    setInterval(function() {
        if(url!=location.href){
          addUrlRecord('intervalCheck')({
            oldURL: url,
            newURL: location.href,
            timeStamp: getTimeStamp() // 模拟时间戳
          })
          url = location.href
        }
    }, 250);
  } else {
    edithAddEventListener('hashchange', addUrlRecord('hashchange'))
    edithAddEventListener('navigationChange', addUrlRecord())
  }
}


class BreadcrumbsPlugin {
  constructor(props = {}) {
    this.name = 'breadcrumbs'
    this.state = {
    }
  }
  apply(compiler) {
    const that = this;
    compiler(this.name, function({ state, ajaxWhiteList: _ajaxWhiteList }, callback) {
      if(!state[that.name]) {
        ajaxWhiteList = _ajaxWhiteList
        navigationProxy() // 自定义路由跳转事件
        behaviorRecord()
      }
      // callback(compressString(JSON.stringify(breadcrumbs)))
      callback(breadcrumbs)
    })
  }
}
if(!window.Edith) window.Edith = {}
window.Edith.BreadcrumbsPlugin = BreadcrumbsPlugin
export default BreadcrumbsPlugin
