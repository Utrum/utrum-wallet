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

export const func  = {
  "updateLink" : "https://utrum.io/",
  "minConfirmations": 3,
  "enabledCoins": ["DP", "OOT", "KMD", "BTC"]
}

var bitcore    = require('bitcore-lib');
bitcore.Networks.add({
  name: 'ootnet',
  alias: 'mainnet',
  pubkeyhash: 0x3c,
  privatekey: 0xbc,
  scripthash: 0x55,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  networkMagic: 0xf9eee48d,
  port: 8333,
  dnsSeeds: [
    'seed.komodoplatform.com'
  ]
});
bitcore.Networks.defaultNetwork = bitcore.Networks.get('ootnet');
