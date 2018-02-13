import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
  {
    path: '/',
    component: require('@/components/Home').default,
    children: [
    {
      path: '/login',
      name: 'login-form',
      component: require('@/components/LoginForm').default,
    },
    {
      path: '/createpassphrase', 
      name: 'createpassphrase',
      component: require('@/components/CreatePassphrase').default
    },
    ]
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: require('@/components/WalletView').default,
    children: [
    {
      path: '/balance', 
      name: 'balance',
      component: require('@/components/WalletViews/Balance').default
    },
    {
      path: '/buy',
      name: 'buy',
      component: require('@/components/WalletViews/Buy').default
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: require('@/components/WalletViews/Withdraw').default
    }
    ]
  },
  {
    path: '*',
    redirect: '/login'
  }
  ]
})
