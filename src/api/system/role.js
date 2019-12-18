import request from '@/utils/request'

export const baseData={
  list:'/ebap-core/a/sys/role/listData',//获取列表
  sava:"/ebap-core/a/sys/role/save", //新增Or 修改
  update:"/ebap-core/a/sys/role/getRoleById",//修改
  delete:"/ebap-core/a/sys/role/delete", //删除
  menuS:"/ebap-core/a/sys/menu/listData",//包含角色
  userListS:"/ebap-core/a/sys/user/listData" //用户下拉选项
}



//新增 OR　修改
export function addOrUpdate(data) {
  return request({
    url: '/ebap-core/a/sys/menu/save',
    method: 'post',
    data
  })
}
//删除
export function deleteRow(data) {
  return request({
    url: '/ebap-core/a/sys/role/delete',
    method: 'post',
    data
  })
}
