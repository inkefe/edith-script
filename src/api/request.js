import { stringifyParams } from '../utils'
let xmlhttp = null

const getPromise = (xmlhttp, callback) => new Promise((resolve, reject) => {
  xmlhttp.onreadystatechange = () => {
    if(xmlhttp.readyState !== 4) return
    if (xmlhttp.status === 200) {
      // console.log(xmlhttp.responseText)
      let res = {}
      try {
        res = JSON.parse(xmlhttp.responseText)
      } catch(e){
        res = xmlhttp.responseText
      }
      resolve(res)
    } else if(xmlhttp.status > 399) {
      reject(xmlhttp.responseText)
    }
  }
  callback()
})

const request = {
  root: '/',
  setRoot(host) {
    this.root = host
  },
  getRootByUrl(url) {
    url = url.replace(/^http(s?):\/\//, '//')
    return url.match(/^\/\//) ? '' : this.root
  },
  get(url) {
    return (parmas = {}) => {
      xmlhttp = new XMLHttpRequest()
      const root = this.getRootByUrl(url)
      return getPromise(xmlhttp, () => {
        xmlhttp.open('GET', `${root}${url}?${stringifyParams(parmas)}`, true)
        // xmlhttp.withCredentials = true;
        xmlhttp.send()
      })
    }
  },
  post(url) {
    return (parmas = {}) => {
      xmlhttp = new XMLHttpRequest()
      const root = this.getRootByUrl(url)
      const fn = () => {
        xmlhttp.open('POST', `${root}${url}`, true)
        xmlhttp.setRequestHeader('Content-type','application/json;charset=utf-8');
        // xmlhttp.withCredentials = true;
        xmlhttp.send(JSON.stringify(parmas));
      }
      if(IS_DEV){
        return getPromise(xmlhttp, fn)
      }else fn()
    }
  }
}

export default request
