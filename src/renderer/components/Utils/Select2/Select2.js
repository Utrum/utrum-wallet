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

import 'select2';

export default {
  name: 'select2',
  props: ['options', 'value'],
  mounted: function () {
    const vm = this;
    $(this.$el)
      // init select2
      .select2({ data: this.options })
      .val(this.value)
      .trigger('change')
      // emit event on change.
      .on('change', function () {
        vm.$emit('input', this.value);
      });
    this.$root.$on('select2:open', () => {
      $(this.$el).select2('open');
    });
  },
  watch: {
    value: function (value) {
      // update value
      $(this.$el).val(value);
    },
    options: function (options) {
      // update options
      $(this.$el).empty().select2({ data: options });
    },
  },
  destroyed: function () {
    $(this.$el).off().select2('destroy');
  },
};
