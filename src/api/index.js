// 接口文档： http://apidoc.csinke.cn/project/lmiSmNmmge.html
import reportRequest from './request'
import { serviceRoot } from '../config'

reportRequest.setRoot(serviceRoot)

export const reportDebug = reportRequest.post('/v1/monitor/add'); //上报

export const measureBWSimple = reportRequest.get('/v1/upload/test-img'); //测试网速

export const reportScriptError = reportRequest.post('/v1/monitor/script-add') // 上报脚本自身错误

if(IS_DEV) {
  const postEnv = reportRequest.post('/v1/apikey-env/update'); //上报
  window.postEnv = () => {
    postEnv({apiKey: 'YXBpS2V5MTU5Mzc3Mzg1Ng', env: 'test', url: 'etdith', id: '19'}).then(res => {
      // console.log(res)
    }).catch(e => {})
  }
}
