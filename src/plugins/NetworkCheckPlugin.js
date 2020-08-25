import { getAarege, measureBW, measureDelay, testNetworkSpeed, getNetworkType } from '../utils'

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
  // 网络速度
  checkNetSpeed() {
    const speed = testNetworkSpeed()
    if(speed) return this.speeds.push(speed)
    measureBW(speed => this.speeds.push(speed), 3)
  }
  checkDelay () {
    measureDelay(tcp => this.delays.push(tcp), 5)
  }
  startCheck() {
    const rIC = window.requestIdleCallback
    if (!rIC) {
      setTimeout(this.checkDelay.bind(this), Math.random() * 6000 + 500) // 随机延后执行
      return setTimeout(this.checkNetSpeed.bind(this), Math.random() * 7000 + 500)
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
    rIC(myNonEssentialWork, { timeout: 2000 });
  }

  apply(compiler) {
    const that = this
    compiler(that.name, function({ state }, callback) {
      if(!state[that.name]){
        that.startCheck.apply(that)
      }
      const { netWorkType } = that.state
      callback({
        speed: getAarege(that.speeds),
        delay: getAarege(that.delays),
        netWorkType
      })
    })
  }
}
if(!window.Edith) window.Edith = {}
window.Edith.NetworkCheckPlugin = NetworkCheckPlugin
export default NetworkCheckPlugin
