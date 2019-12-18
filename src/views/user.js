import { login, logout, getInfo,getMenu } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  userId:''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERID:(state, userId)=>{
    state.userId = userId;
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response;
        // Cookies.set('Token', response.data)
       // this.$store.commit('set_token', data);
        commit('SET_TOKEN', data['ebap.session.id']);
        commit('SET_USERID', data['userId']);
        setToken(data['userId']);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    console.log(3333);
    commit('SET_NAME', 'admin'); // TODO 调试完成后是删除
    commit('SET_AVATAR', name);
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //
    //     const { data } = response;
    //     data.name='admin';
    //     if (!data) {
    //       reject('Verification failed, please Login again.')
    //     }
    //     // const { name, avatar } = data
    //     commit('SET_NAME', 'admin');
    //     commit('SET_AVATAR', name);
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  getMnu({ commit, state }) {
   return new Promise((resolve, reject) => {
     getInfo(state.token).then(response => {
     const { data } = response;
     data.name='admin';
     if (!data) {
     reject('Verification failed, please Login again.')
     }
     // const { name, avatar } = data
     commit('SET_NAME', 'admin');
     commit('SET_AVATAR', name);
     resolve(data)
     }).catch(error => {
     reject(error)
     })
     })
  },
  getMnuList({ commit, state },data) {
    return new Promise((resolve, reject) => {
      getMenu(data).then(response => {
        const { data } = response;
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    // window.sessionStorage.removeItem('routesList_tmp')
    // window.location.href='/logout'
    return new Promise((resolve, reject) => {
      logout().then(response => {
        console.log(response);
        resolve()
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

