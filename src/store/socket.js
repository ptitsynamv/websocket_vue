import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
  state: {
    messages: [],
    users: []
  },
  mutations: {
    SOCKET_SET_MESSAGE(state, payload) {
      state.messages = payload;
    },
    SOCKET_USERS(state, message) {
      state.users = message;
    },
  },
  actions: {
    setUsers({commit, getters}, payload) {
      let usersArray = [];
      Object.values(payload).forEach(user => {
        usersArray.push(user);
        if (user.id === getters.userChat.id) {
          commit('setUserChat', {...getters.userChat, ...user})
        }
      });
      commit('SOCKET_USERS', usersArray);
    },
    setMessages({commit, state}, payload) {
      commit('SOCKET_SET_MESSAGE', state.messages.concat(payload.message));
    },
    clearSocket({commit}) {
      commit('SOCKET_USERS', []);
      commit('SOCKET_SET_MESSAGE', []);
    }
  },
  getters: {
    users(state, getters) {
      return state.users.filter(u => u.id !== getters.userChat.id)
    },
    messages(state) {
      return state.messages.sort((a, b) => {
        return Date.parse(a.date) - Date.parse(b.date);
      });
    }
  }
}

