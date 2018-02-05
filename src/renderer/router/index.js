import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login-form',
      component: require('@/components/LoginForm').default
    ***REMOVED***,
    {
      path: '/wallets',
      name: 'wallets-view',
      component: require('@/components/WalletView').default
    ***REMOVED***,
    {
      path: '*',
      redirect: '/'
    ***REMOVED***
  ]
***REMOVED***)
