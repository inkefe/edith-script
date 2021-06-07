// import { utils.edithAddEventListener } from '../utils'
import { getTagName, eventTrigger, getRandomID, getTimeStamp, getXPath,
  isIE8, isWhite } from '../common'

let utils = {}
const ie8 = isIE8()
// 用户行为记录的最多数量
const RECORD_COUNT = 15
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
function add(data, breadcrumbs) {
  let index = -1 // 如果有相同的eid，代表只需要修改
  breadcrumbs.forEach((item, i) => {
    if(data.eid && item.eid === data.eid && index === -1) {
      index = i
    }
  })
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
  const outerHTML = utils.getSimpleString(errorTarget.outerHTML)
  const record = {
    type,
    time: utils.getCurrentTime(),
    timeStamp: getTimeStamp(), 
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
  add(record, breadcrumbs)
};

const addUrlRecord = method => event => {
  const record = {
    type: 'navigation',
    time: utils.getCurrentTime(),
    method: method || event.detail.method,
    timeStamp: getTimeStamp(),
    detail: {
      from: {
        url: utils.getSimpleString(event.oldURL || event.detail.oldURL),
        title: document.title
      },
      to: {
        url: utils.getSimpleString(event.newURL || event.detail.newURL),
      }
    }
  }
  add(record, breadcrumbs)
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
      url: utils.getSimpleString(responseURL || url, 150), // 接口响应地址
    }
  }
  add(record, breadcrumbs)
}

// 记录ajax请求
const recordAjax = () => {
  const callBack = e => {
    const { target: xhr, time } = e.detail
    xhr._eid = xhr._eid || getRandomID()
    xhr.timeStamp = xhr.timeStamp || getTimeStamp()
    xhr.endTime = time // 不断更新状态
    addHttpRecord(xhr)
  }
  utils.edithAddEventListener('ajaxOpen', callBack)
  utils.edithAddEventListener('ajaxProgress', callBack);
  // 当XHR发生 abort / timeout / error 时事件触，loadend是最后触发的
  utils.edithAddEventListener('ajaxLoadEnd', callBack);
}
// getAllResponseHeaders没有
const recordFetch = () => {
  const callBack = e => {
    const { target: { options }, time } = e.detail
    options.timeStamp = options.timeStamp || getTimeStamp()
    const xhr = {
      ...options,
      ...e.detail,
      endTime: time,
      // requestHeader: options.headers
    }
    addHttpRecord(xhr, 'fetchRequest')
  }
  utils.edithAddEventListener('fetchStart', callBack);
  utils.edithAddEventListener('fetchEnd', callBack);
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
  add(record, breadcrumbs)
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

    ws.timeStamp = ws.timeStamp || getTimeStamp()
    addWebSocketRecord(type)(ws)
  }
  utils.edithAddEventListener('webSocketStart', callback('open', true))
  utils.edithAddEventListener('webSocketOpen', callback('open'))
  utils.edithAddEventListener('webSocketClose', callback('close'))
}

const behaviorRecord = () => {
  utils.edithAddEventListener('click', addActionRecord('click'), true)
  recordAjax()
  recordFetch()
  recordWebSocket() // 监听webSocket
  if(ie8) {
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
    utils.edithAddEventListener('hashchange', addUrlRecord('hashchange'))
    utils.edithAddEventListener('navigationChange', addUrlRecord())
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
    compiler(this.name, function({ state, ajaxWhiteList: _ajaxWhiteList, utils: _utils }, callback) {
      utils = _utils
      if(!state[that.name]) {
        ajaxWhiteList = _ajaxWhiteList
        navigationProxy() // 自定义路由跳转事件
        behaviorRecord()
      }
      callback(utils.compressData(breadcrumbs))
      // callback(breadcrumbs)
    })
  }
}
// if(!window.Edith) window.Edith = {}
// window.Edith.BreadcrumbsPlugin = BreadcrumbsPlugin
export default BreadcrumbsPlugin
