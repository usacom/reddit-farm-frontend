import Vue from 'vue';
import VueLogger from 'vuejs-logger';
import VueLoading from 'vue-loading-overlay';
import DatetimePicker from 'vuetify-datetime-picker';
import vuetify from '@/plugins/vuetify'; // path to vuetify export

import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App.vue';
import router from './router';
import store from './store';
import API from './utils/api';

const loggerOptions = {
  isEnabled: true,
  // logLevel: isProduction ? 'error' : 'debug',
  logLevel: 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true,
};
Vue.use(VueLogger, loggerOptions);
Vue.use(VueLoading);
Vue.use(DatetimePicker);

Vue.config.productionTip = false;
console.log(process.env.VUE_APP_API_PATH);
console.log(`api.${window.location.hostname}/`);
// Vue.prototype.$api = new API(`${window.location.protocol}//api.${window.location.hostname}/`);
Vue.prototype.$api = new API(process.env.VUE_APP_API_PATH);

new Vue({
  // api: new API('http://localhost:8000/'),
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
