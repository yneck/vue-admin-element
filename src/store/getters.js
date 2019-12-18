// const getters = {
//   sidebar: state => state.app.sidebar,
//   device: state => state.app.device,
//   token: state => state.user.token,
//   avatar: state => state.user.avatar,
//   name: state => state.user.name,
//   loginName: state => state.user.loginName,
//   permission_routers: state => state.permission.routes,
//   addRouters: state => state.permission.addRouters
// }
// export default getters
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  loginName: state => state.user.loginName,
  serverRouters: state => state.permission.serverRouters,
  addRouters: state => state.permission.addRouters
};
export default getters
