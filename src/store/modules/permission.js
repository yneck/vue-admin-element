import {constantRoutes} from '@/router';
import {getMenu} from '@/api/user';
import store from "../index";
import Layout from '@/layout'

// 格式化路由，此步骤看情况可删除
function formatRouters(list) {
  let result = []
  for (let i = 0; i < list.length; i++) {
    let firstTemp = list[i]
    let key = firstTemp.redirect
    if (key === "") {
      continue
    }
    let firMenu = {
      path: firstTemp.path,
      component:  Layout,
      name: firstTemp.name,
      children: [],
      redirect: firstTemp.redirect,
      meta: firstTemp.meta,
  }
    let childs = [];
    for (let j = 0; j < firstTemp.children.length; j++) {
      let secTmpName = firstTemp.children[j].path
      if (secTmpName === "") {
        continue
      }
      let secondMenuTmp = firstTemp.children[j];
      let str = secondMenuTmp.name
      let parentStr=firstTemp.name;
      let secondMenu = {
        path: secondMenuTmp.path,
        component: () => import(`@/views/${parentStr}/${str}/index`),
        name: secondMenuTmp.name,
        // redirect: secondMenuTmp.redirect,
        meta: secondMenuTmp.meta,
        menuId: secondMenuTmp.menuId,
        href: secondMenuTmp.meta,
    }
      childs.push(secondMenu)

    }
    firMenu.children.push(...childs);
    result.push(firMenu)
  }
  // let error= { path: '*', redirect: '/404', hidden: true };
  // result.push(error)
  // console.log(result);
  return result
}


function getLocalRoutes() {
  return JSON.parse(window.sessionStorage.getItem('routesList_tmp'))
}

const permission = {
  state: {
    addRouters: [],
    serverRouters: constantRoutes,
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.serverRouters = constantRoutes.concat(routers)
    },
    SAVE_ROUTERS: (state, routers) => {
      window.sessionStorage.setItem('routesList_tmp', JSON.stringify(routers))
    }
  },
  actions: {
    GenerateRoutes({commit}, data) {
      return new Promise(resolve => {
        // 此处为权限判断，不需要可删除
        commit('SAVE_ROUTERS', formatRouters(data));
        commit('SET_ROUTERS', formatRouters(data));
        resolve()
      })
    }
  }
}

export default permission
