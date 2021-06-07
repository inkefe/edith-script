import '@inke-design/edith-record'
/*
const JSON_KEY = { type: '≠', childNodes: 'ā', name: 'á', id: 'ǎ', tagName: 'à', attributes: 'ē', style: 'é', textContent: 'ě', isStyle: 'è', isSVG: 'ī', content: 'í', href: 'ǐ', src: 'ì', class: 'ō', tabindex: 'ó', 'aria-label': 'ǒ', viewBox: 'ò', focusable: 'ū', 'data-icon': 'ú', width: 'ǔ', height: 'ù', fill: 'ǖ', 'aria-hidden': 'ǘ', stroke: 'ǚ', 'stroke-width': 'ǜ', 'paint-order': 'ü', 'stroke-opacity': 'ê', 'stroke-dasharray': 'ɑ', 'stroke-linecap': '?', 'stroke-linejoin': 'ń', 'stroke-miterlimit': 'ň', 'clip-path': 'Γ', 'alignment-baseline': 'Δ', 'fill-opacity': 'Θ', transform: 'Ξ', 'text-anchor': 'Π', offset: 'Σ', 'stop-color': 'Υ', 'stop-opacity': 'Φ' };
const JSON_CSS_KEY = { background: '≠', 'background-attachment': 'ā', 'background-color': 'á', 'background-image': 'ǎ', 'background-position': 'à', 'background-repeat': 'ē', 'background-clip': 'é', 'background-origin': 'ě', 'background-size': 'è', border: 'Г', 'border-bottom': 'η', color: '┯', style: 'Υ', width: 'б', 'border-color': 'ū', 'border-left': 'ǚ', 'border-right': 'ň', 'border-style': 'Δ', 'border-top': 'З', 'border-width': 'Ω', outline: 'α', 'outline-color': 'β', 'outline-style': 'γ', 'outline-width': 'δ', 'left-radius': 'Ж', 'right-radius': 'И', 'border-image': 'ω', outset: 'μ', repeat: 'ξ', repeated: 'π', rounded: 'ρ', stretched: 'σ', slice: 'υ', source: 'ψ', 'border-radius': 'Б', radius: 'Д', 'box-decoration': 'Й', break: 'К', 'box-shadow': 'Л', 'overflow-x': 'Ф', 'overflow-y': 'У', 'overflow-style': 'Ц', rotation: 'Ч', 'rotation-point': 'Щ', opacity: 'Ъ', height: 'Ы', 'max-height': 'Э', 'max-width': 'Ю', 'min-height': 'Я', 'min-width': 'а', font: 'в', 'font-family': 'г', 'font-size': 'ж', adjust: 'з', aspect: 'и', 'font-stretch': 'й', 'font-style': 'к', 'font-variant': 'л', 'font-weight': 'ф', content: 'ц', before: 'ч', after: 'ш', 'counter-increment': 'щ', 'counter-reset': 'ъ', quotes: 'ы', 'list-style': '+', image: '－', position: '|', type: '┌', margin: '┍', 'margin-bottom': '┎', 'margin-left': '┏', 'margin-right': '┐', 'margin-top': '┑', padding: '┒', 'padding-bottom': '┓', 'padding-left': '—', 'padding-right': '┄', 'padding-top': '┈', bottom: '├', clear: '┝', clip: '┞', cursor: '┟', display: '┠', float: '┡', left: '┢', overflow: '┣', right: '┆', top: '┊', 'vertical-align': '┬', visibility: '┭', 'z-index': '┮', direction: '┰', 'letter-spacing': '┱', 'line-height': '┲', 'text-align': '6', 'text-decoration': '┼', 'text-indent': '┽', 'text-shadow': '10', 'text-transform': '┿', 'unicode-bidi': '╀', 'white-space': '╂', 'word-spacing': '╁', 'hanging-punctuation': '╃', 'punctuation-trim': '1', last: '3', 'text-emphasis': '4', 'text-justify': '5', justify: '7', 'text-outline': '8', 'text-overflow': '9', 'text-wrap': '11', 'word-break': '12', 'word-wrap': '13' }

// 简化录屏JSON中的key值
function compressJson (o) {
  if (o instanceof Array) {
    return o.map(item => compressJson(item))
  } else if (o instanceof Object) {
    var n = {}
    Object.entries(o).forEach(([i, value]) => {
      // 转换css属性
      if (i === "_cssText") {
        let cssText = value
        cssText = cssText.replace(/ {/g, "{").replace(/; /g, ";").replace(/: /g, ":").replace(/, /g, ",").replace(/{ /g, "{")
        for (var key in JSON_CSS_KEY) {
          var cssAttr = JSON_CSS_KEY[key]
          var cssReg = new RegExp(key, 'g');
          cssText = cssText.replace(cssReg, cssAttr)
        }
        o[i] = cssText
      }
      // 转换录屏自带字段
      if (JSON_KEY[i]) {
        n[JSON_KEY[i]] = compressJson(o[i])
        delete n[i]
      } else {
        n[i] = compressJson(o[i])
      }
    })
    return n
  }
  return o
}
*/
class RecordPlugin {
  constructor(props = {}) {
    this.name = 'redo'
  }
  // 开始录屏
  startRecordVideo() {
    // 使用二维数组来存放多个 event 数组, 
    this.eventsMatrix = [[]]
    const that = this
    window.edithRecord({
      blockClass: 'edith-block',
      ignoreClass: 'edith-ignore',
      emit(event, isCheckout) {
        // isCheckout 是一个标识，告诉你重新制作了快照
        if (isCheckout) {
          that.eventsMatrix.push([])
          that.eventsMatrix = that.eventsMatrix.slice(-3)
        }
        const lastEvents = that.eventsMatrix[that.eventsMatrix.length - 1];
        lastEvents.push(event);
      },
      checkoutEveryNth: 30, // 每 40 个 event 重新制作快照
      checkoutEveryNms: 30000, // 每30秒新制作快照
    });

  }
  // 向后端传送最新的两个 event 数组
  getRedo = () => {
    const [ a, b = [] ] = this.eventsMatrix.slice(-2)
    const events = [...a, ...b]
    this.eventsMatrix = this.eventsMatrix.slice(-2)
    return events
  }

  apply(compiler) {
    const that = this;
    compiler(that.name, function({ state, utils }, callback) {
      if(!state[that.name]) that.startRecordVideo()
      callback(utils.compressData(that.getRedo()))
    })
  }
}
// if(!window.Edith) window.Edith = {}
// window.Edith.RecordPlugin = RecordPlugin
export default RecordPlugin
