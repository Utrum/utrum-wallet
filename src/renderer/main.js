/** ***************************************************************************
 * Copyright © 2018 Monaize Singapore PTE. LTD.                               *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Monaize Singapore PTE. LTD software, including this file may be copied,    *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

import BootstrapVue from 'bootstrap-vue';
import VueQriously from 'vue-qriously';
import VueClipboard from 'vue-clipboard2';
import VueQrcodeReader from 'vue-qrcode-reader';
import Vue from 'vue';
import axios from 'axios';
import Toasted from 'vue-toasted';
import 'vue-loaders/dist/vue-loaders.css';
import * as VueLoaders from 'vue-loaders';

import App from './App.vue';
import router from './router';
import store from './store';

require('bootstrap/dist/css/bootstrap.min.css');
require('@fortawesome/fontawesome-free/css/all.min.css');
const vueElectron = require('vue-electron');

Vue.use(BootstrapVue);
Vue.use(VueQriously);
Vue.use(VueClipboard);
Vue.use(VueQrcodeReader);
Vue.use(Toasted, {
  iconPack: 'material',
  position: 'top-right',
  duration: 4000,
});
Vue.use(VueLoaders);

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
