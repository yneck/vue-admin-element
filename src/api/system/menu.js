import request from '@/utils/request'

export  const baseData={
  list:"/ebap-core/a/sys/menu/listData",
  save:"/ebap-core/a/sys/menu/save",
  superMenu:"/ebap-core/a/sys/menu/listDataWithoutButton",
  inLevelS:"/ebap-core/a/sys/menu/listDataWithoutButton",
  'btnTypeS':"/ebap-core/a/sys/dict/getDictListJson",//按钮类型
}

export function getMenuList(data) {
  return request({
    url:"/ebap-core/a/sys/menu/listData",
    method:"post",
    data
  })
}
