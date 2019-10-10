/**
 * 请求接口方法调用
 */
import request from '@/utils/request'

/**
 * 登陆方法
 * @param userName 用户名
 * @param userPwd 密码
 */
export function login(userName, userPwd) {
  const params = new URLSearchParams()
  params.append('userName', userName)
  params.append('userPwd', userPwd)
  return request({
    url: '/login',
    method: 'post',
    data: params
  })
}

/**
 * 获取用户信息方法
 * @param id 入参 用户id
 */
export function getInfo(id) {
  return request({
    url: '/org/group/get',
    method: 'post',
    params: { id: id}
  })
}

/**
 * 用户退出方法
 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
