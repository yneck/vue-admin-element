import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/a/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/ebap-core/a/sys/menu/getInitMenu',
    method: 'post'
  })
}
export function logout() {
  return request({
    url: '/a/logout',
    method: 'get'
  })
}

// 获取菜单
export function getMenuList(data) {
  console.log(data);
  return request({
    url: '/ebap-core/a/sys/menu/getInitMenu',
    method: 'post',
    data
  })
}

//获取左侧列表
export function getMenu(data) {
  return request({
    url: '/ebap-core/a/sys/menu/getInitMenu',
    method: 'post',
    data
  })
}

export function listPie() {
  return request({
    url: '/ebap-core/',
    method: 'post'
  })
}
export function listBar() {
  return request({
    url: '/ebap-core/',
    method: 'post'
  })
}
export function listChar() {
  return request({
    url: '/ebap-core/',
    method: 'post'
  })
}

export function list() {
  return request({
    url: '/ebap-core/',
    method: 'post'
  })
}


