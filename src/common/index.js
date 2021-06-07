const ua = navigator.userAgent
const referrer = document.referrer

// 获取当前时间戳
export const getCurrentTime = () => new Date().getTime()

// 生成随机ID
export const getRandomID = () => {
  return ('' + getCurrentTime() * Math.random()).slice(0, 8)
}

// 获取当前相对于页面打开时的时间戳
export const getTimeStamp = () => ~~(performance.now())
// 自定义事件触发的公共方法
export const eventTrigger = function (event) {
  window.dispatchEvent(new CustomEvent(event, { detail: { target: this, time: getCurrentTime() } }));
}

export const isFunction = fn => typeof fn === 'function'

// 判断是否是成功的请求状态码,不包含跨域，超时等请求
export const isSuccess = (status) => status < 400

// 获取Dom的xpath
export const getXPath = (element) => {
  if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
    return `//*[@id="${element.id}"]`;
  }
  //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
  if (element == document.body) {//递归到body处，结束递归
    return '/html/' + element.tagName.toLowerCase();
  }
  var ix = 1,//在nodelist中的位置，且每次点击初始化
    siblings = element.parentNode.childNodes;//同级的子元素

  for (var i = 0, l = siblings.length; i < l; i++) {
    var sibling = siblings[i];
    //如果这个元素是siblings数组中的元素，则执行递归操作
    if (sibling == element) {
      return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
      //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
    } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
      ix++;
    }
  }
};
// 获取省略字符，中间用省略号代替
export const getSimpleString = (str, length = 200) => {
  // 如果点击的内容过长，就截取上传
  str = typeof str === 'string' ? str : JSON.stringify(str)
  if (str && str.length > length) {
    const len = Math.max(length - 100, 50)
    str = str.substr(0, len) + '... ...' + str.substr(len - length + 50)
  }
  return str || ''
}
const removeHttpAndQuery = (url) =>
  url.replace(/^[^/]*:?\/\//, '').split('?')[0]
// 判断是不是在白名单
export const isWhite = (list, url) => {
  return list.some((i) => {
    if (i instanceof RegExp) return i.test(url)
    if (typeof i !== 'string') return
    return removeHttpAndQuery(i) === removeHttpAndQuery(url)
  })
}
// 给外链script添加crossorigin属性，防止报anonymous错误
export function setScriptCross() {
  var scripts = document.getElementsByTagName('script')
  for (var s of scripts) {
    const url = removeHttpAndQuery(s.src || '')
    url && url[0] !== '/' && s.setAttribute('crossorigin', 'anonymous');
  }
}
export const isIE8 = () => {
  var ua = navigator.userAgent.toLowerCase()

  var isIE = ua.indexOf('msie') > -1

  var safariVersion = isIE ? ua.match(/msie ([\d.]+)/)[1] : 100
  return safariVersion <= 8
}

//获取元素的tagName, 兼容极低版本的问题
export const getTagName = (el) => {
  if (!el) return ''
  if (el === document) return 'html'
  if (el.tagName) return el.tagName
  return el.outerHTML.match(/<([^>\s]+)/)[1]
}


// 组合 参数
export const getErrorInfo = err => {
  const error = err.error || {}
  return {
    type: err._type || err.type, // 错误的类型，如httpError
    name: (err.name || err.message && err.message.split(':')[0] || err.type)?.replace(/^Uncaught\s/, ''), // 错误信息的名称
    message: getSimpleString(err.message || err.description || '', 300), // 错误信息的内容
    extraInfo: err.extraInfo || null,
    stacktrace: err.error && error.stack, // 错误的执行栈
    target: err._target,
    timeStamp: getTimeStamp(),
    title: document.title, // 报错页面的标题
    referrer, // 从哪个页面跳转过来
    url: location.href,
    userAgent: ua,
    columnNumber: err.colno || error.columnNumber,
    lineNumber: err.lineno || error.lineNumber,
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

