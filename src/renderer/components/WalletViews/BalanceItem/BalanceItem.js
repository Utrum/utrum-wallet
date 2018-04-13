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

import QrcodeModal from '@/components/Utils/QrcodeModal/QrcodeModal.vue';

export default {
  name: 'balance-item',
  components: {
    'qrcode-modal': QrcodeModal,
  },
  props: {
    wallet: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isClipboard: false,
    };
  },
  methods: {
    getUnconfirmedColor(amount) {
      return (amount > 0) ? 'positiveColor' : 'negativeColor';
    },
    getQRCodeClass(amount) {
      return amount === 0 ? 'row-custom' : '';
    },
    numberWithSpaces(x) {
      if (Number(x) > 0) {
        const parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return parts.join('.');
      }
      return x;
    },
    onCopy() {
      const self = this;
      this.isClipboard = true;
      setTimeout(() => {
        self.isClipboard = false;
      }, 1000);
    },
  },
};
