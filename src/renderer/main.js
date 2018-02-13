import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

import VueSweetAlert from 'vue-sweetalert'
Vue.use(VueSweetAlert)

import VueQriously from 'vue-qriously'
Vue.use(VueQriously)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

axios.config =  axios.create({
  timeout: 10000,
  transformRequest: [(data) => JSON.stringify(data.data)],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  ***REMOVED***
***REMOVED***);

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App ***REMOVED***,
  router,
  store,
  template: '<App/>'
***REMOVED***).$mount('#app')
