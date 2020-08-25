import { stringifyParams } from '../utils'
let xmlhttp = null
let root = '/'

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
  setRoot: host => {
    root = host
  },
  get: url => (parmas = {}) => {
    xmlhttp = new XMLHttpRequest()
    return getPromise(xmlhttp, () => {
      xmlhttp.open('GET', `${root}${url}?${stringifyParams(parmas)}`, true)
      // xmlhttp.withCredentials = true;
      xmlhttp.send()
    })
  },
  post: url => (parmas = {}) => {
    xmlhttp = new XMLHttpRequest()
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

export default request
