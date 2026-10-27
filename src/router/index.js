import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NewObject from '@/components/Object/NewObject'
import Object from '@/components/Object/Object'
import ObjectList from '@/components/Object/ObjectList'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'
import Orders from '@/components/User/Orders'
import Chat from '@/components/Chat/Chat'
import ChatLogin from '@/components/Chat/ChatLogin'
import AuthGuard from './auth.guard'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Home
    },
    {
      path: '/object/:id',
      name: 'object',
      props: true,
      component: Object
    },
    {
      path: '/list',
      name: 'list',
      component: ObjectList,
      beforeEnter: AuthGuard
    },
    {
      path: '/new',
      name: 'newObject',
      component: NewObject,
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
      beforeEnter: AuthGuard
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      beforeEnter: AuthGuard
    },
    {
      path: '/chat-login',
      name: 'chatLogin',
      component: ChatLogin,
    },
    {
      path: '/chat-logout',
      name: 'chatLogout',
      beforeEnter: (to, from, next) => {
        this.a.app.$store.dispatch('clearSocket');
        this.a.app.$socket.emit('logout', this.a.app.$store.getters.userChat.token);
        this.a.app.$store.dispatch('chatLogoutUser');
        this.a.app.$router.push('/')
      }
    },
  ],
  mode: 'history'
})
