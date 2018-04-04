import BootstrapVue from 'bootstrap-vue';
import VueQriously from 'vue-qriously';
import VueClipboard from 'vue-clipboard2';
import VueQrcodeReader from 'vue-qrcode-reader';
import Vue from 'vue';
import axios from 'axios';
import Toasted from 'vue-toasted';
import Vue2Filters from 'vue2-filters';

import App from './App.vue';
import router from './router';
import store from './store';

require('bootstrap/dist/css/bootstrap.min.css');
const vueElectron = require('vue-electron');

Vue.use(BootstrapVue);
Vue.use(VueQriously);
Vue.use(VueClipboard);
Vue.use(VueQrcodeReader);
Vue.use(Vue2Filters);
Vue.use(Toasted, {
  iconPack: 'material',
  position: 'top-right',
  duration: 4000,
});

if (!process.env.IS_WEB) Vue.use(vueElectron);

axios.config =  axios.create({
  timeout: 10000,
  transformRequest: [(data) => JSON.stringify(data.data)],
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
