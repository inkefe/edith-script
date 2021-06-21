/**
 * 基于rrweb里的解压方法pack，改造的解压数据方法
 */
import { strFromU8, strToU8, zlibSync } from 'fflate/esm/browser.js'

// event 可以是任一类型
export function pack(event) {
  event = typeof event === 'string' ? event : JSON.stringify(event)
  return strFromU8(zlibSync(strToU8(event)), true)
}
/*
// raw为字符串
export function unpack(raw) {
  if (typeof raw !== 'string') {
    return raw
  }
  let e
  try {
    e = JSON.parse(raw)
    return e
  } catch (error) {
    //
  }
  try {
    e = JSON.parse(strFromU8(unzlibSync(strToU8(raw, true))))
    return e
  } catch (error) {
    console.error(error)
    return null
  }
}
*/
