class ChatUser {
  constructor({color, email, id, isAdmin, isBan, isMute, token}) {
    this.color = color;
    this.email = email;
    this.id = id;
    this.isAdmin = isAdmin;
    this.isBan = isBan;
    this.isMute = isMute;
    this.token = token;
  }
}

export default {
  state: {
    userChat: null,
  },
  mutations: {
    setUserChat(state, payload) {
      state.userChat = payload;
      localStorage.setItem('userChat', JSON.stringify(payload));
    },
    unsetUserChat(state) {
      state.userChat = null;
      localStorage.removeItem('userChat');
    }
  },
  actions: {
    chatLoginUser({commit}, {email, password}) {
      commit('clearError');
      commit('setLoading', true);

      Vue.http.post('/api/auth/login', {email, password})
        .then(response => response.json())
        .then(data => {
          commit('setUserChat', new ChatUser(data));
          commit('setLoading', false);
        })
        .catch(e => {
          commit('setError', e);
          commit('setLoading', false);
        });

    },
    chatLogoutUser({commit}) {
      commit('unsetUserChat');
    }
  },
  getters: {
    userChat(state) {
      return state.userChat
    },
    isUserLoggedInChat(state) {
      return state.userChat !== null
    }
  }
}
