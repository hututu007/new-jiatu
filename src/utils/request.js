/**
 * axios请求
 */
import axios from 'axios'
import qs from 'qs'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import router from '../router'

/**
* 创建axios实例 **
*/
const BASE_API = process.env.BASE_API.toString()  // 取环境变量url

const service = axios.create({
  baseURL: BASE_API, // api的base_url
  withCredentials: true // 允许携带cookie
})

/**
*  request发起请求拦截器 *
**/

service.interceptors.request.use(config => {
  // 在发送请求前将数据用qs模块转化，并修改请求头的Content-Type='application/x-www-form-urlencoded'
  if (config.method != 'post') {
    config.data = qs.stringify(config.data);
  }
  if ( config.ContentType === undefined) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }else {
    config.headers['Content-Type'] = config.ContentType;
  }
  // 设置请求头，避免跨域问题
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

/**
*respone请求响应拦截器
*/
service.interceptors.response.use(response => {
  // code为非0是抛错
  const userId = store.getters.id
  const res = response.data
  if (res.code !== 0) {
    if (res.code === 10010) {
      return
    }
    Message({
      message: res.msg,
      type: 'error',
      duration: 2 * 1000
    })
    if (!userId) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      })
    }

    return Promise.reject('error')
  } else {
    return response.data
  }
},
error => {
  console.log(error)// for debug
  Message({
    message: '连接服务器失败，请稍后重试！',
    type: 'error',
    duration: 2 * 1000
  })
  return Promise.reject(error)
}
)

export default service
