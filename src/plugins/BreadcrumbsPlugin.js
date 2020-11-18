import { getTagName, edithAddEventListener, getRandomID, getXPath,
  isIE8, getOuterHTML, getCurrentTime, getTimeStamp } from '../utils'
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
    page: {
      url: location.href,
      title: document.title
    },
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
  const { method, status, statusText, responseURL, originUrl, body = null,
    startTime, endTime, _eid, timeStamp } = xhr
  const elapsedTime = endTime - startTime // 请求耗时
  if(ajaxWhiteList.indexOf(originUrl && originUrl.split('?')[0]) >= 0) return //白名单接口不记录
  const record = {
    eid: _eid,
    type,
    time: getCurrentTime(),
    timeStamp,
    page: {
      url: location.href,
      title: document.title
    },
    elapsedTime,
    detail: {
      method, // 请求方法
      status, // 状态码
      body, // post请求的body
      // requestHeader,
      // responseHeader: xhr.getAllResponseHeaders() || {}, // 这个方法不能解构出来赋值
      statusText, // 状态
      responseURL, // 接口响应地址
      originUrl, // 请求的原始参数地址
    }
  }
  breadcrumbs.add(record)
}

// 记录ajax请求
const recordAjax = () => {
  edithAddEventListener('ajaxOpen', e => {
    const xhr = e.detail
    xhr._eid = getRandomID()
    xhr.timeStamp = e.timeStamp
    addHttpRecord(xhr)
  })
  edithAddEventListener('ajaxProgress', e => {
    const xhr = e.detail
    // console.log(xhr)
    xhr.endTime = getCurrentTime() // 不断更新状态
    addHttpRecord(xhr)
  });
  // 当XHR发生 abort / timeout / error 时事件触，loadend是最后触发的
  edithAddEventListener('ajaxLoadEnd', e => {
    const xhr = e.detail
    xhr.endTime = getCurrentTime()
    addHttpRecord(xhr)
  });
}
// getAllResponseHeaders没有
const recordFetch = () => {
  edithAddEventListener('fetchStart', e => {
    const { options } = e.detail
    const xhr = {
      ...options,
      timeStamp: e.timeStamp,
      // requestHeader: options.headers
    }
    // console.log(xhr)
    addHttpRecord(xhr, 'fetchRequest')
  });
  edithAddEventListener('fetchEnd', e => {
    const { options, url } = e.detail
    const xhr = {
      ...options,
      responseURL: url,
      // requestHeader: options.headers,
      endTime: getCurrentTime(),
      timeStamp: e.timeStamp,
      ...e.detail,
    }
    // console.log('fetchEnd=>', xhr.status, e.detail)
    addHttpRecord(xhr, 'fetchRequest')
  });
}

const addWebSocketRecord = method => event => {
  const { ws, timeStamp } = event
  const record = {
    eid: ws._eid,
    type: 'webSocket',
    time: getCurrentTime(),
    timeStamp,
    method: method || event.detail.method,
    elapsedTime: ws.elapsedTime, // 建立连接耗时
    detail: {
      url: ws.url,
      readyState: ws.readyState,
    }
  }
  breadcrumbs.add(record)
}

// 记录WebSocket，建立连接和断开，算两次不同的行为记录
const recordWebSocket = () => {
  edithAddEventListener('webSocketStart', e => {
    
    const { target: ws } = e.detail
    ws.startTime = getCurrentTime()
    ws.elapsedTime = 0
    ws._eid = getRandomID()
    // e.detail.timeStamp = e.timeStamp
    const timeStamp = e.timeStamp
    addWebSocketRecord('open')({ws, timeStamp})
  })
  edithAddEventListener('webSocketOpen', e => {
    const { target: ws } = e.detail
    ws.openTime = getCurrentTime()
    ws.elapsedTime = ws.openTime - ws.startTime
    // e.detail.timeStamp = e.timeStamp
    const timeStamp = e.timeStamp
    addWebSocketRecord('open')({ws, timeStamp})
  })

  edithAddEventListener('webSocketClose', e => {
    
    const { target: ws } = e.detail
    ws._eid = getRandomID()
    ws.endTime = getCurrentTime()
    // e.detail.timeStamp = e.timeStamp
    const timeStamp = e.timeStamp
    ws.elapsedTime = ws.endTime - (ws.openTime || ws.startTime)
    addWebSocketRecord('close')({ws, timeStamp})
  })

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
      callback(breadcrumbs)
    })
  }
}
if(!window.Edith) window.Edith = {}
window.Edith.BreadcrumbsPlugin = BreadcrumbsPlugin
export default BreadcrumbsPlugin
