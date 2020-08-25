import { reportDebug } from '../api'
import { EDITH_STATUS, innerPluginsCdn, innerPlugins, remixProps } from '../config'
import { loadCdnScript, getPromiseResult, isFunction } from '../utils'

const remix = ['linkWhiteList', 'ajaxWhiteList']
class _Edith {
  constructor(props) {
    this.state = {}
    this.life = ''
  }

  $life(status) {
    this.life = status
  }

  // change life
  init(nextState) {
    if(this.life ) return console.warn('只需要初始化一次')
    const { apiKey, silentDev, plugins } = nextState || {}
    if(!nextState || !apiKey) {
      return console.warn('请传入项目的apiKey')
    }
    this.$life(EDITH_STATUS.INIT)
    if(silentDev && location.host.match(/^localhost|^\d+\.\d+\./)) return this._sleep()
    this._willMount(nextState);
    this.plugins = plugins instanceof Array ? plugins.filter(Boolean) : []
    remix.forEach(key => {
      this[key] = [...remixProps[key], ...(nextState[key] || [])]
    })
    // will
    // set config
    const preState = this.state;
    this.state = this.initSate = { ...preState, apiKey }

    // did
    this._didMount(this.state);
    // check
    this._checkSelf().then(() => {
      this.$life(EDITH_STATUS.INSTALL_PLUGIN)
      // install plugns
      this._installPlugins().then(() => {
        // star
        this._collecting(); // 加载插件立即初始化一次
        if (isFunction(this.pluginInstalled)) {
          this.pluginInstalled()
        }
        this.$life(EDITH_STATUS.LISTENING)
      })
    }).catch(() => this._sleep())
  }

  setState(nextState, byPlugins) {
    if(this.life === EDITH_STATUS.COLLECTING && !byPlugins) return // 收集错误信息阶段，只允许收集插件的相关信息
    const preState = this.state
    this.state = { ...preState, ...nextState }
  }
 
  _willMount() {
    this.$life(EDITH_STATUS.WILL_MOUNT)
    if (isFunction(this.willMount === 'function')) {
      this.willMount()
    }
  }
 
  _didMount() {
    this.$life(EDITH_STATUS.DID_MOUNT)
    if (isFunction(this.didMount)) {
      this.didMount()
    }
  }

  _checkSelf() {
    this.$life(EDITH_STATUS.CHECK_SELF)
    return new Promise((resolve, reject) => {
      if (isFunction(this.checkSelf)) {
        try{
          this.checkSelf()
        }catch(e){
          console.log('edith自检发生错误', e)
          reject(e)
        }
      } else {
        console.log('no check self parts')
      }
      resolve()
    })
  }

  _installPlugins() { // 安装加载插件
    return new Promise((resolve, reject) => {
      // console.log(this.plugins)
      const promiseList = []
      this.plugins.forEach(plugin => {
        if(typeof plugin === 'string') {
          if(FORMAT === 'iife') { // 如果打包成cdn链接
            const inner = innerPluginsCdn[plugin]
            if(inner) {
              promiseList.push(loadCdnScript(inner.link, inner.name))
            }
          } else if(FORMAT === 'es') { // 如果打包成npm模块
            const inner = innerPlugins[plugin]()
            if(inner) {
              promiseList.push(inner)
            }
          }
        }else promiseList.push(plugin)
      }) 
      getPromiseResult(promiseList).then(pluginList => {
        pluginList = pluginList.map(item => isFunction(item.default) ? new item.default() : item)
          // 得到对应插件
          pluginList.forEach(plugin => {
          remix.forEach(key => { // 混入插件内部定义的链接白名单和http白名单
            this[key] = [...this[key], ...(plugin[key] || [])]
          })
        })
        this.plugins = pluginList
        resolve()
      })
    })
  }

  compilerCallback(pluginName, subInfo) {
    this.setState({
      [pluginName]: subInfo
    }, true)
  }

  compiler(pluginName, fn) {
    const compilerCallback = this.compilerCallback;
    const that = this;
    fn(this, function(subInfo) {
      compilerCallback.call(that, pluginName, subInfo)
    })
  }

  _collecting() { // 收集插件的数据,或用于插件数据初始化
    this.plugins.forEach(plugin => {
      if(!plugin.apply) return console.warn(`Edith插件[${plugin.constructor.name}]必须实现apply方法`)
      try{
        plugin.apply(this.compiler.bind(this))
      }catch(e){
        console.log(e)
      }
    });
  }

  _sleep() {
    this.$life(EDITH_STATUS.SLEEP); // 不上报，不检测
    this.$life = () => {}
    if (isFunction(this.sleep)) {
      this.sleep()
    }
    this.$handleCollect = () => {} // 停止上传
  }
  // 上报
  $handleCollect() {
    if(this.life !== EDITH_STATUS.LISTENING) return // 收集错误信息过程中不上报
    this.$life(EDITH_STATUS.COLLECTING)
    setTimeout(() => { // 在所有队列后执行错误，避免点击立即出发的报错，没有记录点击事件
      this._collecting()
      const parmas = {...this.state}
      reportDebug(parmas)
      this.state = this.initSate //上报完成去掉
      this.$life(EDITH_STATUS.LISTENING)
    }, 0)
  }
}

export default _Edith