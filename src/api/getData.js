/**
 * 请求接口方法调用
 */
import request from '@/utils/request'
import Vue from 'vue'

export function getData(url, method, obj, tips) {
  const $vue = new Vue()
  const params = new URLSearchParams()
  for (var key in obj) { // 遍历键值对
    params.append(key, obj[key])
  }
  const result = request({
    url: url,
    method: method,
    data: params
  })

  // 状态提示
  if (tips) {
    result.then(res => {
      // 成功
      if (res.code === 0) {
        $vue.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
            } else {
        $vue.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
            }
    })
  }

  return result
}
