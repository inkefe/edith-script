module.exports = {
  // options 指向Chrome可执行程序，一般不需要配置此项，除非你想测试某个特定版本的Chrome npm publish --access public
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  // required 要测试的url
  url: 'https://h5.yingtaorelian.com/innerapp-2020/red-packet/index.html',
  // options 本次测试需要用到的Cookies，通常是登录信息（即你测试的页面需要登录） Array | Object
  cookies: [],
  // options 测试次数 默认为20次
  count: 2,
  // options 是否使用无头模式 默认为true
  headless: true,
  // options 是否禁用缓存 默认为false 
  noCache: false,
  // options 是否禁掉JavaScript 默认为false
  noJavascript: false,
  // options 是否禁掉网络 默认为false
  noOnline: false,
  // options 设置指定的useragent信息
  useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
  // options 设置视口信息
  viewport: {
     // options
     'width': 375,
     // options
     'height': 812,
     // options devicePixelRatio 默认为1
     'deviceScaleFactor': 3,
     // options 是否模拟成mobile 默认为false
     'isMobile': false,
     // options 是否支持touch时间 默认为false
     'hasTouch': false,
     // options 是否是横屏模式 默认为false
     'isLandscape': false
  }
}