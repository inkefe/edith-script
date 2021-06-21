import { getFID, getLCP, getFCP } from 'web-vitals';

class PerformancePlugins {
  constructor() {
    this.name = 'performance'
  }
  getData = () => {
    // 首次输入延迟，FID（First Input Delay），记录在 FCP 和 TTI 之间用户首次与页面交互时响应的延迟。
    getFID(this.setState('FID'));
    // 最大内容绘制，LCP（Largest Contentful Paint），
    getLCP(this.setState('LCP'))
    // 首次内容绘制，FCP（First Contentful Paint），这个指标用于记录页面首次绘制文本、图片、非空白 Canvas 或 SVG 的时间。
    getFCP(this.setState('FCP'))
  }
  state = {
    timing: window.performance.timing
  }

  setState = (type) => res => {
    this.state[type] = ~~res.value
  }

  apply(compiler) {
    const that = this
    compiler(that.name, function(_, callback) {
      that.getData()
      callback(that.state)
    })
  }
}
export default PerformancePlugins
