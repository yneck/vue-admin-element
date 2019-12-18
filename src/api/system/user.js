import request from '@/utils/request'
//以S结尾 代表 下拉框数据接口
//基本数据
export let baseData={
  'list':'/ebap-core/a/sys/user/listData',//获取列表
  'sava':"/ebap-core/a/sys/user/save", //新增Or 修改
  'delete':"/ebap-core/a/sys/user/delete", //删除
  'yes_noS':"/ebap-core/a/sys/dict/getDictListJson",//有效期下拉列表
  'rolesS':"/ebap-core/a/sys/role/listData" //所属角色
}

