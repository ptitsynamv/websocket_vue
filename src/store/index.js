import Vue from "vue"
import Vuex from 'vuex'
import object from './object'
import user from './user'
import shared from './shared'
import orders from './orders'
import userChat from './userChat'
import socket from './socket'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    object,
    user,
    shared,
    orders,
    userChat,
    socket
  }
})
