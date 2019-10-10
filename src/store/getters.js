/**
 * vuex 的计算属性 缓存用户信息
 */
const getters = {
  sidebar: state => state.app.sidebar, // 左侧导航栏
  device: state => state.app.device,   // 设备识别
  // token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  resIds: state => state.user.resIds,
  id: state => state.user.id,
  orgId: state => state.user.orgId,
  point: state => state.user.point,
  session: state => state.user.session,
  barList: state => state.user.barList
}
export default getters
