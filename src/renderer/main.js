import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import jQuery from 'jquery'

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
