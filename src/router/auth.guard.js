import store from '../store/index'

export default function (to, from, next) {
  if (to.name === 'chat') {
    if (store.getters.userChat) {
      if(store.getters.userChat.isBan){
        store.commit('setError', 'You are ban');
        next('/')
      }
      next()
    } else {
      next('/chat-login?loginError=true')
    }
  } else {
    if (store.getters.user) {
      next()
    } else {
      next('/login?loginError=true')
    }
  }
}
