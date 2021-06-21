
import { isFunction } from '../common'
import { reportDebug, measureBWSimple, getWhiteList } from '../api'
import { EDITH_STATUS, innerPluginsCdn, innerPlugins, remixProps } from '../config'
import { loadCdnScript, getPromiseResult, edithAddEventListener, minSize, compressData,
  reportEdithError, transToString, tryCatchFn, checkLocalData, loopTask, getOnlyTag } from '../utils'

const remix = ['resourceWhiteList', 'ajaxWhiteList'] // 顺序别换
const getListConfig = item => { // match_type 1.字符串匹配; 2. 正则匹配;
  if(+item.match_type === 2) {
    const res = item.match.match(/\/(\w)*$/);
    return new RegExp(item.match.slice(1, res.index), res[1])
  }
  return item.match
}

class _Edith {
  life = ''
  plugins = []
  state = {
    plugins: {}
  }

  utils = {
    compressData,
    compressString: compressData, // 防止旧版本报错
    measureBWSimple,
    edithAddEventListener
  }

  $life (status) {
    this.life = status
  }

  // change life
  init = (nextState) => {
    if (this.life) return console.warn('只需要初始化一次')
    if(this._waitPromise(nextState)) return
    const { apiKey, silentDev } = nextState || {}
    if (!nextState || !apiKey) {
      return console.warn('请传入项目的apiKey')
    }
    this.$life(EDITH_STATUS.INIT)
    this.setState({ api_key: apiKey })
    if (silentDev && location.host.match(/^localhost|[\d.]+$/)) {
      this.notListening = true // 不监听错误了
    }
    this._willMount(nextState);
    this.initState = { ...this.state }
    
    // did
    this._didMount(this.state);
    // check
    this._checkSelf().then(() => {
      this.$life(EDITH_STATUS.INSTALL_PLUGIN)
      // install plugns
      this._installPlugins(this).then(() => {
        // star
        this._collecting(); // 加载插件立即初始化一次
        this.initState = { ...this.state }
      })
      isFunction(this.pluginInstalled) && this.pluginInstalled()
      this.$life(EDITH_STATUS.LISTENING)
    }).catch(this._sleep.bind(this))
  }
  _waitPromise (nextState) {
    if(window.Promise) return
    edithAddEventListener('promisePolyfill', () => this.init(nextState))
    return true
  }

  setState = (nextState, byPlugins) => {
    if (this.life === EDITH_STATUS.COLLECTING && !byPlugins) return // 收集错误信息阶段，只允许收集插件的相关信息
    const preState = this.state
    this.state = { ...preState, ...nextState }
  }

  _willMount (nextState) {
    const { plugins } = nextState
    this.$life(EDITH_STATUS.WILL_MOUNT)
    isFunction(this.willMount) && this.willMount(nextState)
    this.plugins = plugins instanceof Array ? plugins : []
    remix.forEach((key) => {
      this[key] = [...(this[key] || []), ...remixProps[key]]
    })
    const itemWhiteList = (list, type) => list.filter(item => +item.type === type ).map(getListConfig)
    getWhiteList({ apiKey: this.apiKey }).then(res => {  // 1. 资源报错白名单；2.接口白名单
      remix.forEach((key, index) => {
        this[key] = this[key].concat(itemWhiteList(res.data || [], index + 1))
      })
    }).catch(e => {}) 
  }

  _didMount () {
    this.$life(EDITH_STATUS.DID_MOUNT)
    isFunction(this.didMount) && this.didMount()
    loopTask(this)
  }

  _checkSelf () {
    this.$life(EDITH_STATUS.CHECK_SELF)
    return new Promise((resolve, reject) => {
      if (isFunction(this.checkSelf)) {
        try {
          this.checkSelf()
        } catch (e) {
          console.log('edith自检发生错误', e)
          reportEdithError('SelfCheckError', e)
          reject(e)
        }
      }
      resolve()
    })
  }

  _installPlugins () { // 安装加载插件
    return new Promise((resolve, reject) => {
      // console.log(this.plugins)
      const promiseList = []
      this.plugins.forEach(plugin => {
        if(!plugin) return
        if (typeof plugin === 'string') {
          if (FORMAT === 'iife') { // 如果打包成cdn链接
            const inner = innerPluginsCdn[plugin]
            inner && promiseList.push(loadCdnScript(inner.link, inner.name))
          } else { // 如果打包成npm模块
            const inner = innerPlugins[plugin]
            inner && promiseList.push(inner())
          }
        } else promiseList.push(plugin)
      })
      getPromiseResult(promiseList).then((pluginList) => {
        pluginList = pluginList.map(item => isFunction(item.default) ? new item.default() : item)
        // 得到对应插件
        pluginList.forEach((plugin) => {
          plugin && remix.forEach((key) => { // 混入插件内部定义的链接白名单和http白名单
            this[key] = [...this[key], ...(plugin[key] || [])]
          })
        })
        this.plugins = pluginList
        resolve()
      })
    })
  }
  // 非内置插件的字段数据都在plugins里，内置插件属性的值直接添加到state里
  compilerCallback = (pluginName, subInfo) => {
    const state = { [pluginName]: subInfo }
    this.setState(innerPluginsCdn[pluginName] ? state : {
      plugins: {
        ...this.state.plugins,
        ...state
      }
    }, true)
  }

  compiler = (pluginName, fn) => {
    const compilerCallback = this.compilerCallback;
    const that = this;
    fn(this, function (subInfo) {
      compilerCallback.call(that, pluginName, subInfo)
    })
  }

  _collecting () { // 收集插件的数据,或用于插件数据初始化
    this.plugins.forEach(plugin => {
      const { name }= plugin.constructor
      if (!plugin.apply) return innerPluginsCdn[plugin] || console.warn(`Edith插件[${plugin.constructor.name}]必须实现apply方法`)
      try {
        plugin.apply(this.compiler.bind(this))
      } catch (e) {
        reportEdithError('CollectError',{
          error: transToString(e),
          plugin: name,
          life: this.life
        })
      }
    })
    isFunction(this.collecting) && this.collecting()
  }

  _sleep () {
    this.$life(EDITH_STATUS.SLEEP); // 不上报，不检测
    this.$life = () => { }
    isFunction(this.sleep) && this.sleep()
    this.$handleCollect = () => { } // 停止上传
  }

  reportDebug = reportDebug

  // 上报
  $handleCollect () {
    if (this.life !== EDITH_STATUS.LISTENING) return // 收集错误信息过程中不上报
    this.$life(EDITH_STATUS.COLLECTING)
    var timer = setTimeout(tryCatchFn(() => { // 在所有队列后执行错误，避免点击立即出发的报错，没有记录点击事件
      const parmas = this.state
      const onlyTag = getOnlyTag(parmas)
      if(!checkLocalData(onlyTag)) {
        const filtersParmas = {
          name: parmas.name,
          message: parmas.message,
          url: parmas.url,
          title: parmas.title,
          ajax: parmas.extraInfo || {
            url: ''
          },
          target: parmas.target || {},
        }
        // console.log(parmas)
        if(!(this.filters(filtersParmas)) || parmas.type === 'customError'){
          this._collecting() // 收集插件数据
          this.reportDebug({
            ...this.state,
            onlyTag,
            plugins: compressData(minSize(this.state.plugins)) // 限制plugins数据大小
          }) // filters方法返回真值，则代表拦截
        } 
      }
      this.state = this.initState //上报完成去掉
      this.$life(EDITH_STATUS.LISTENING)
      clearTimeout(timer)
      timer = null
    }), 16)
  }
}

export default _Edith
