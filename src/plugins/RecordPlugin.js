import '@inke-design/edith-record'


class RecordPlugin {
  constructor(props = {}) {
    this.name = 'redo'
  }
  // 开始录屏
  startRecordVideo() {
    // 如果某个DOM节点配置了_edith-private的class，那么该元素在插件进行录制前就会被预先隐藏掉来保障隐私安全。
    // 使用二维数组来存放多个 event 数组, 
    this.eventsMatrix = [[]]
    const that = this
    window.edithRecord({
      emit(event, isCheckout) {
        // isCheckout 是一个标识，告诉你重新制作了快照
        if (isCheckout) {
          that.eventsMatrix.push([]);
        }
        const lastEvents = that.eventsMatrix[that.eventsMatrix.length - 1];
        lastEvents.push(event);
      },
      checkoutEveryNth: 100, // 每 100 个 event 重新制作快照
      checkoutEveryNms: 60 * 1000 // 每60秒重新制作快照
    });

  }
  // 向后端传送最新的两个 event 数组
  getRedo () {
    const [ a, b = [] ] = this.eventsMatrix.slice(-2)
    const events = [...a, ...b]
    
    return events
  }

  apply(compiler) {
    const that = this;
    compiler(that.name, function({ state }, callback) {
      if(!state[that.name]) that.startRecordVideo()
      callback(that.getRedo())
    })
  }
}
if(!window.Edith) window.Edith = {}
window.Edith.RecordPlugin = RecordPlugin
export default RecordPlugin
