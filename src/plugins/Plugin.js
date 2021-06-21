class Plugin {
  constructor(props) {
    this.state = {}
  }

  apply(compiler) {
    const that = this
    if(!this.name) return console.warn('Edith的插件必须指定name')
    compiler('compilation', function({ state }, callback) {
      callback(that.state)
    })
  }
}

export default Plugin

