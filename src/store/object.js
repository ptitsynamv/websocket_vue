import * as fb from 'firebase'

class MyObject {
  constructor(title, description, ownerId, promo = false, imageSrc = '', id = null) {
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.promo = promo;
    this.imageSrc = imageSrc;
    this.id = id;
  }
}


export default {
  state: {
    objects: []
  },
  mutations: {
    createObject(state, payload) {
      state.objects.push(payload)
    },
    loadObjects(state, payload) {
      state.objects = payload
    },
    updateObject(state, {title, description, id}) {
      const ob = state.objects.find(v => v.id === id);
      ob.title = title;
      ob.description = description;
    }
  },
  actions: {
    async createObject({commit, getters}, payload) {
      commit('clearError');
      commit('setLoading', true);

      const image = payload.image;

      try {
        const newObject = new MyObject(
          payload.title,
          payload.description,
          getters.user.id,
          payload.promo,
          ''
        );
        const object = await fb.database().ref('objects').push(newObject);
        const imageExt = image.name.slice(image.name.lastIndexOf('.'));
        fb.storage().ref(`objects/${object.key}.${imageExt}`).put(image)
          .then(snapshot => {
            return snapshot.ref.getDownloadURL();
          })
          .then(imageSrc => {
            console.log(`Successfully uploaded file and got download link - ${imageSrc}`);

            fb.database().ref('objects').child(object.key).update({
              imageSrc
            });

            commit('setLoading', false);
            commit('createObject', {
              ...newObject,
              id: object.key,
              imageSrc
            });
            commit('setLoading', false);

          });

      } catch (e) {
        commit('setError', e.message);
        commit('setLoading', false);
        throw e;
      }
    },
    async fetchObjects({commit}) {
      commit('clearError');
      commit('setLoading', true);
      const resultOb = [];

      try {
        const fbValue = await fb.database().ref('objects').once('value');
        const objects = fbValue.val();
        Object.keys(objects).forEach(key => {
          const ob = objects[key];
          resultOb.push(new MyObject(ob.title, ob.description, ob.ownerId, ob.promo, ob.imageSrc, key))
        });
        commit('loadObjects', resultOb);
        commit('setLoading', false);
      } catch (e) {
        commit('setError', e.message);
        commit('setLoading', false);
        throw e;
      }
    },
    async updateObject({commit}, {title, description, id}) {
      commit('clearError');
      commit('setLoading', true);

      try {
        await fb.database().ref('objects').child(id).update({
          title, description
        });
        commit('updateObject', {
          title, description, id
        });

        commit('setLoading', false);
      } catch (e) {
        commit('setError', e.message);
        commit('setLoading', false);
      }
    }
  },
  getters: {
    objects(state) {
      return state.objects
    },
    promoObjects(state) {
      return state.objects.filter(v => v.promo)
    },
    myObjects(state, getters) {
      return state.objects.filter(v => v.ownerId === getters.user.id);
    },
    objectById(state) {
      return objectId => {
        return state.objects.find(ob => ob.id === objectId)
      }
    }
  }
}
