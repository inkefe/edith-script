const getAverage = (arr) => {
  const total = arr.reduce((total, item) => total + item, 0)
  return arr.length === 0 ? -1 : total / arr.length
}
// 测网速,返回单位为KB/sec的数值
// https://juejin.im/post/5b4de6b7e51d45190d55340b
const testNetworkSpeed = () => {
  const n = navigator
  const c = 'connection'
  const d = 'downlink'
  if (n[c] && n[c][d]) {
    // 在 Chrome65+ 的版本中，有原生的方法
    return (n[c][d] * 1024) / 8 //单位为KB/sec
  }
}

// 获取网络类型
// https://juejin.im/post/5b4de6b7e51d45190d55340b
const getNetworkType = () => {
  const n = navigator
  const c = 'connection'
  const e = 'effectiveType'
  if (n[c] && n[c][e]) {
    // 在 Chrome65+ 的版本中，有原生的方法
    return n[c][e] //单位为KB/sec
  }
  return ''
}

class NetworkCheckPlugin {
  constructor() {
    this.name = 'network'
    this.state = {
      speed: -1,
      delays: -1,
      netWorkType: getNetworkType(),
    }
    this.speeds = []
    this.delays = []
  }
  // 通过发起http请求，测试网络速度, 定时调用回调，参数为单位为KB/sec的数值
  measureBW = (fn, time) => {
    const { getCurrentTime, measureBWSimple } = this.utils
    const test = n => {
      const startTime = getCurrentTime();
      measureBWSimple({ t : Math.random() }).then(res => {
        const fileSize = res.length
        const endTime = getCurrentTime();
        var speed = fileSize / ((endTime - startTime)/1000) / 1024;
        fn && n && fn(Math.floor(speed));
        if(n >= time) return
        test(++n)
      }).catch(e => {}) 
    }
    test(0)
  }

  // 事件阻止
  eventPresent = (e) => {
    if (!e) return
    const func = ['preventDefault', 'stopPropagation']
    func.forEach((item) => e[item] && e[item]())
    e.cancelBubble = true
  }

  // 获取延迟,通过js加载一张1x1的极小图片，来测试图片加载的所用的时长
  measureDelay = (fn, count) => {
    const { getCurrentTime, tryCatchFunc } = this.utils
    count = count || 1
    let n = 0
    const src = '//webcdn.inke.cn/edith.cn/hm.gif?'
    const ld = () => {
        const t = getCurrentTime(), img = new Image;
        img.onload = () => {
            const tcp = getCurrentTime() - t
            n++
            fn(tcp) // 存储延迟回调
            if(n < count) setTimeout(ld, 1000)
        }
      img.src = src + Math.random()
      img.onerror = tryCatchFunc(this.eventPresent)
    }
    const img_start = new Image()
    img_start.onerror = tryCatchFunc(this.eventPresent)
    img_start.onload = ld
    img_start.src = src + Math.random()
  }

  // 网络速度
  checkNetSpeed() {
    const speed = testNetworkSpeed()
    if(speed) return this.speeds.push(speed)
    this.measureBW(speed => this.speeds.push(speed), 1)
  }
  checkDelay () {
    this.measureDelay(tcp => this.delays.push(tcp), 4)
  }
  startCheck() {
    const rIC = window.requestIdleCallback
    if (!rIC) {
      setTimeout(this.checkDelay.bind(this), Math.random() * 6000 + 1000) // 随机延后执行
      return setTimeout(this.checkNetSpeed.bind(this), Math.random() * 7000 + 1200)
    }
    // 任务队列
    const tasks = [
      this.checkDelay.bind(this), // 检测延迟
      this.checkNetSpeed.bind(this), // 检测网速
    ];
    function myNonEssentialWork (deadline) {
      // 如果帧内有富余的时间，或者超时
      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
        tasks.shift()()
      }
      tasks.length > 0 && rIC(myNonEssentialWork);
    }
    rIC(myNonEssentialWork, { timeout: 7000 });
  }

  apply(compiler) {
    const that = this
    compiler(that.name, function({ state, utils }, callback) {
      that.utils = utils
      if(!state[that.name]){
        that.startCheck.apply(that)
      }
      const { netWorkType } = that.state
      callback({
        speed: getAverage(that.speeds),
        delay: getAverage(that.delays),
        netWorkType
      })
    })
  }
}
// if(!window.Edith) window.Edith = {}
// window.Edith.NetworkCheckPlugin = NetworkCheckPlugin
export default NetworkCheckPlugin
