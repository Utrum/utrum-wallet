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

import Vue from 'vue';
import Router from 'vue-router';
import Buy from '@/components/WalletViews/Buy/Buy.vue';
import LoginForm from '@/components/LoginForm/LoginForm.vue';
import Home from '@/components/Home/Home.vue';
import CreatePassphrase from '@/components/CreatePassphrase/CreatePassphrase.vue';
import WalletView from '@/components/WalletViews/WalletView.vue';
import Balance from '@/components/WalletViews/Balance/Balance.vue';
import Withdraw from '@/components/WalletViews/Withdraw/Withdraw.vue';
import TermsAndConditions from '@/components/TermsAndConditions/TermsAndConditions.vue';
import Disclamer from '@/components/Disclamer/Disclamer.vue';

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
      path: '/termsAndConditions',
      component: TermsAndConditions,
    },
    {
      path: '/disclamer',
      component: Disclamer,
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
});
