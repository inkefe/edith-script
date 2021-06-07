// /* eslint-disable no-undef */
// import { compressToBase64 } from 'lz-string'
// import { pack } from 'rrweb/lib/record/rrweb-record-pack'
import { pack } from './pack'
import { reportScriptError } from './api'
import { cdnUrl } from './config'
// console.log(LZString.compress('object'))
const performance = window.performance
/**
 * 参数格式化, 符合url方式
 * @params {Object} {a: '123', age: '18'}
 * @return {String} 'a=123&age=18'
 */
export const stringifyParams = (params, cb) => {
  let name
  let value
  let str = ''

  for (name in params) {
    value = params[name]
    str += name + '=' + (
      typeof cb === 'function' ?
        cb(value, name) :
        value && typeof value === 'object' && !Object.getPrototypeOf(value).slice ? JSON.stringify(value) : value ) + '&'
  }
  return str.slice(0, -1)
}

// 获取ua环境信息
export const uaInfo = (() => {
  const uaInfo = navigator.userAgent.match(/[^(\s]+(\s\([^)]+\))?/g)
  return uaInfo
})()


/**
 * 把数据保存到本地
 */
export const saveLocalData = (key, item, isSession) => {
  const storage = isSession ? sessionStorage : localStorage
  try {
    if (item === void 0) storage.removeItem(key)
    else storage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.warn(error)
  }
}
/**
 * 读取本地数据
 */
export const getLocalData = (key, isSession) => {
  let res = null
  try {
    if (key === void 0) {
      let allName = Object.keys(isSession ? sessionStorage : localStorage)
      if (allName.length > 0) {
        res = {}
        allName.forEach((keyName) => {
          res[keyName] = getLocalData(keyName)
        })
      }
    } else
      res = JSON.parse(
        (isSession ? sessionStorage : localStorage).getItem(key)
      )
  } catch (error) {
    console.warn(error)
  }
  return res
}

// 对方法进行封装，防止内部报错
export const tryCatchFn = (fn, edith) => function(...args) {
    try {
      typeof fn !== 'function' && (fn = () => {})
      return fn.apply(this, args)
    } catch (error) {
      console.warn('edith 内部报错', error)
      reportEdithError('EdithError', error, edith)
    }
  }

// 通用事件监听方法
export const edithAddEventListener = (name, fn, useCapture) => {
  
  if (addEventListener) {
    // 所有主流浏览器，除了 IE 8 及更早版本
    addEventListener(name, tryCatchFn(fn), useCapture)
  } else if (window.attachEvent) {
    // IE 8 及更早版本
    window.attachEvent(`on${name}`, tryCatchFn(fn))
  }
}


// 执行环境监测以及性能
export const getPerform = () => {
  // const getEntriesByType = 'getEntriesByType'
  if (!performance) {
    // console.warn('edith 内部报错: 当前环境不支持性能监控', )
    return false
  }
  return {
    timing: performance.timing,
    // chromeLoadingTiming: chrome && chrome.loadTimes(),
    // entriesTiming: {
    //   navigation: per[getEntriesByType]('navigation'),
    //   paint: per[getEntriesByType]('paint'),
    //   resource: per[getEntriesByType]('resource').filter(item => !item.name.match(/hm\.baidu\.com\/hm\.gif/)),
    // },
  }
}
  

// 异步加载scripts标签
export const loadScript = (url, cb, reject = () => {}) => {
  const script = document.createElement('script')
  script.setAttribute('cdn-rendered', '')
  script.src = url
  script.onload = cb
  script.onerror = reject
  document.getElementsByTagName('head')[0].appendChild(script)
  // document.head.appendChild(script)
}
// 异步加载插件，封装成promise
export const loadCdnScript = (url, name) =>
  new Promise((resolve, reject) => {
    loadScript(url, () => resolve({ default: window.Edith[name] }), reject)
  })

// 避免map方法进入reject
export const getPromiseResult = (promises) => {
  const handlePromise = Promise.all(
    promises.map((fn) => (fn.catch ? fn.catch((err) => 0) : fn))
  )
  return handlePromise
}



// 得到Headers对象里的数据
export const getHeaders = h => {
  const header = {}
  if (h instanceof Headers) {
    for (var p of h) {
      header[p[0]] = p[1]
    }
    return header
  }
  return h
}
const MORE_DATA_TIP = '[large size Edith Plugins Data]'
const MIN_SIZE = 6 * 1024 * 1024 // 4kb
export const minSize = tryCatchFn((params) => {
  const res = {}
  for (var name in params) {
    var value = params[name]
    res[name] = transToString(value) > MIN_SIZE
          ? MORE_DATA_TIP
          : value
  }
  return res
})
// 如果是Error，则取stack
export function transToString(p) {
  return (p && typeof p === 'object' && p instanceof Error ? p.stack : p) || ''
}
// 压缩对象成加密压缩的字符串
export function compressData (p) {
  p = pack(transToString(p))
  return p
}
let apiKey = ''
export function reportEdithError (name, err, edith) {
  edith && edith.apiKey && (apiKey = edith.apiKey)
  reportScriptError({
    version: EDITH_VERSION,
    format: FORMAT,
    name,
    message: compressData(err),
    scriptUrl: cdnUrl,
    userAgent: navigator.userAgent,
    apiKey
  })
}

// 将每个错误生成唯一key，用错判断是否为重复错误
export function getOnlyTag(err) {
  
}


/*
// 汉字转unicode
export const ch2Unicode = (data) => {
  if (data === '') return ''
  const res = data.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function(
    char
  ) {
    return '\\u' + char.charCodeAt(0).toString(16)
  })
  return res
}
// unicode转汉字
export const unicode2Ch = (asciicode) => {
  asciicode = asciicode.split('\\u')
  var nativeValue = asciicode[0]
  for (var i = 1; i < asciicode.length; i++) {
    var code = asciicode[i]
    nativeValue += String.fromCharCode(parseInt('0x' + code.substring(0, 4)))
    if (code.length > 4) {
      nativeValue += code.substring(4, code.length)
    }
  }
  return nativeValue.replace(/^[\t\r\v\n\f\0]+/, '')
}
*/
