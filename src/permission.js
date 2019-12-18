import router from './router'
import store from './store'
import {getMenu} from '@/api/user';
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

let getRouter=[] //用来获取后台拿到的路由
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const hasUserId=store.getters.userId;
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      // 新增动态路由
      if (getRouter.length <= 0) {//不加这个判断，路由会陷入死循环
        let para = {
          userId: parseInt(getToken())
        };
        //后台获取路由数据
        store.dispatch('user/getMnuList',para).then(res => {
          //处理后台数据为路由格式数据
          store.dispatch('GenerateRoutes', res).then(() => {
            getRouter = store.getters.serverRouters //后台拿到路由 TODO 此处没有合并静态路由（404之类的）
            routerGo(to, next) //执行路由跳转方法
          });
        }).catch(err => {
          console.log(err);
        });
      } else {
        if (to.path && to.path != "/404") { // 判断路径
          console.log("------[beforeEach]save curent route:", 'lastRoute_' + store.getters.loginName, to.path)
          window.sessionStorage.setItem('lastRoute_' + store.getters.loginName, to.path)
        }
        next()
      }

    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})


function routerGo(to, next) {
  router.options.routes = getRouter
  router.addRoutes(getRouter) // 动态添加可访问路由表
  if (to.path == "/404") {
    let redict = window.sessionStorage.getItem('lastRoute_' + store.getters.loginName)
    console.log("------[routerGo]get curent route:", 'lastRoute_' + store.getters.loginName, redict)
    if (redict == null) {
      next("/home")
    } else if (redict && redict.length > 0) {
      next(redict)
    } else {
      next()
    }
  } else {
    console.log(to);
    next({...to, replace: true})
  }
}
