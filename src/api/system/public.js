import request from '@/utils/request'

//获取列表 新增或者修改 删除
export function basicsApi(url,data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

//创建新对象
export function createNewObj(obj, keys) {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  },{});
}

//下拉框数据处理
export function  getTree (tree = []) {
  let arr = [];
  if (tree.length !== 0) {
    tree.forEach(item => {
      let obj = {};
      obj.label = item.name;
      obj.id = parseInt(item.id);
      if(item.children.length>1) {
        obj.children = getTree(item.children);
      }
      arr.push(obj);
    });
  }
  return arr
}


