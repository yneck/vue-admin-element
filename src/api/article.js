import request from '@/utils/request'

export function fetchArticleHead() {
  return request({
    url: '/ebap-business/a/micros/listMicrosTableHead',
    method: 'post'
  })
}

export function fetchList(query) {
  return request({
    url: '/ebap-business/a/micros/listMicro',
    method: 'post',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/ebap-business/a/micro/findById',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/ebap-business/a/micro/save',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/ebap-business/a/micro/save',
    method: 'post',
    data
  })
}
