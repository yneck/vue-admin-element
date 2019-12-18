import Cookies from 'js-cookie'

const TokenKey = 'userId';

export function getToken() {
  //setToken("b527522212f64e769822550a1ebd4a55") // TODO 调试完成后是删除
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove("userId")
}
