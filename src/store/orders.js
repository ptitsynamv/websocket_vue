import * as fb from 'firebase'

class Order {
  constructor(name, phone, objectId, done = false, id = false) {
    this.name = name;
    this.phone = phone;
    this.objectId = objectId;
    this.done = done;
    this.id = id;
  }
}

export default {
  state: {
    orders: []
  },
  mutations: {
    loadOrders(state, payload) {
      state.orders = payload
    }
  },
  actions: {
    async createOrder({commit}, {name, phone, objectId, ownerId}) {
      const order = new Order(name, phone, objectId);
      commit('clearError');
      try {
        await fb.database().ref(`/users/${ownerId}/orders`).push(order)
      } catch (e) {
        commit('setError', e.message);
        throw e;
      }

    },
    async fetchOrders({commit, getters}) {
      commit('setLoading', true);
      commit('clearError');

      const resultOrders = [];
      try {
        const fbVal = await fb.database().ref(`/users/${getters.user.id}/orders`).once('value');
        const orders = fbVal.val();
        Object.keys(orders).forEach(key => {
          const o = orders[key];
          resultOrders.push(new Order(o.name, o.phone, o.objectId, o.done, key))
        });

        commit('loadOrders', resultOrders);
        commit('setLoading', false);
      } catch (e) {
        commit('setLoading', false);
        commit('setError', e.message);
        throw e;
      }
    },
    async markOrderDone({commit, getters}, payload) {
      commit('clearError');
      try {
        await fb.database().ref(`/users/${getters.user.id}/orders`).child(payload).update({
          done: true
      })
      } catch (e) {
        commit('setError', e.message);
        throw e;
      }
    }
  },
  getters: {
    doneOrders(state) {
      return state.orders.filter(o => o.done)
    },
    undoneOrders(state) {
      return state.orders.filter(o => !o.done)
    },
    orders(state, getters) {
      return getters.undoneOrders.concat(getters.doneOrders)
    }

  },
}
