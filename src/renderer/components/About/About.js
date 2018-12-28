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

export default {
  name: 'sidebar',
  created() {
    window.addEventListener('keydown', (e) => {
      if (e.key == 'Escape') {
        this.$router.push('/login-form');        
      }
    });
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$router.push('version');
  },
  methods: {
    closeAbout() {
      if (this.$store.state.User.loggedIn) {
        this.$router.push('wallet');
      } else {
        this.$router.push('login');
      }
    },
    backArrow() {
      this.$router.push('/login-form');            
    },
  },
  computed: {
  },
};
