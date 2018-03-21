import Vue from 'vue';
import Router from 'vue-router';
import Buy from '@/components/WalletViews/Buy/Buy.vue';
import LoginForm from '@/components/LoginForm/LoginForm.vue';
import Home from '@/components/Home/Home.vue';
import CreatePassphrase from '@/components/CreatePassphrase/CreatePassphrase.vue';
import WalletView from '@/components/WalletViews/WalletView.vue';
import Balance from '@/components/WalletViews/Balance/Balance.vue';
import Withdraw from '@/components/WalletViews/Withdraw/Withdraw.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/login',
          name: 'login-form',
          component: LoginForm,
        },
        {
          path: '/createpassphrase',
          name: 'createpassphrase',
          component: CreatePassphrase,
        },
      ],
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletView,
      children: [
        {
          path: '/balance',
          name: 'balance',
          component: Balance,
        },
        {
          path: '/buy',
          name: 'buy',
          component: Buy,
        },
        {
          path: '/withdraw',
          name: 'withdraw',
          component: Withdraw,
        },
      ],
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
});
