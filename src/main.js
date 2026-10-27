import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from './store'
import * as fb from 'firebase'
import BuyModalComponent from '@/components/Shared/BuyModal'
import LoadingComponent from '@/components/Shared/Loading'
import VueResource from 'vue-resource'
import VueSocketio from 'vue-socket.io';


Vue.use(VueResource);
Vue.use(Vuetify, {
  theme: {
    primary: "#BA68C8",
    secondary: "#AB47BC",
    accent: "#9c27b0",
    error: "#FF4081",
    warning: "#ffeb3b",
    info: "#CE93D8",
    success: "#4caf50"
  }
});
Vue.use(VueSocketio, 'ws://localhost:4000', store);

Vue.config.productionTip = false;
Vue.component('app-buy-modal', BuyModalComponent);
Vue.component('app-loading', LoadingComponent);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  created() {
    fb.initializeApp({
      apiKey: 'AIzaSyDi0F_jJIYy_q1g66jHXdwe1heI0A2DCQw',
      authDomain: 'vue-websoket.firebaseapp.com',
      databaseURL: 'https://vue-websoket.firebaseio.com',
      projectId: 'vue-websoket',
      storageBucket: 'vue-websoket.appspot.com',
      messagingSenderId: '910321426132'
    })

    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    });

    this.$store.dispatch('fetchObjects');

    if(localStorage.getItem('userChat')){
      this.$store.commit('setUserChat', JSON.parse(localStorage.getItem('userChat')));
    }

  }
});

window.Vue = Vue;
