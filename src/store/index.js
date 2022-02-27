import Vue from 'vue';
import Vuex from 'vuex';
import API from '../utils/api';

Vue.use(Vuex);
// const api = new API(`${window.location.protocol}//api.${window.location.hostname}/`);
const api = new API(process.env.VUE_APP_API_PATH);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      username: '',
      expires: '',
    },
  },
  getters: {
    auth(state) {
      return state.user;
    },
  },
  mutations: {
    auth(state, user) {
      if (user.username !== undefined && user.expires !== undefined) {
        state.user.loggedIn = true;
        state.user.username = user.username;
        state.user.expires = user.expires;
      }
    },
    setLoginStatus(state, payload) {
      if (payload.username !== undefined && payload.expires !== undefined) {
        state.user.loggedIn = true;
        state.user.username = payload.username;
        state.user.expires = payload.expires;
      }
    },
  },
  actions: {
    loadLoginData(context) {
      return new Promise((resolve) => {
        console.log('store actions loadLoginData');
        api
          .tokenStatus()
          .then((response) => {
            console.log('loadLoginData response', response.data);
            context.commit('setLoginStatus', response.data);
            resolve();
          })
          .catch((err) => {
            resolve();
            console.error(err);
          });
      });
    },
  },
  modules: {},
});
