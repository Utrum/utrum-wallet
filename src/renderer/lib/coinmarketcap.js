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

import axios from 'axios';

export default (ticker, currency, provider) => {
  let tickerlc = ticker.toLowerCase();
  if (!provider) {
    // default
    provider = "coingecko";
  }
  if (provider === "coinpaprika") {
    return axios.get(`https://api.coinpaprika.com/v1/ticker/${tickerlc}-${currency}/`);
  } else if (provider === "coingecko") {
    return axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`);
  } else if (provider === "coinmarketcap") {
    return axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/`);
  }
};
