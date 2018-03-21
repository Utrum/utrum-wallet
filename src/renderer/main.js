import BootstrapVue from 'bootstrap-vue';
import VueSweetAlert from 'vue-sweetalert';
import VueQriously from 'vue-qriously';
import VueClipboard from 'vue-clipboard2';
import VueQrcodeReader from 'vue-qrcode-reader';
import Vue from 'vue';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';

require('bootstrap/dist/css/bootstrap.min.css');
const vueElectron = require('vue-electron');

Vue.use(BootstrapVue);
Vue.use(VueSweetAlert);
Vue.use(VueQriously);
Vue.use(VueClipboard);
Vue.use(VueQrcodeReader);


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
