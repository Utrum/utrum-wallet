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

const sha256 = require('js-sha256');

/**
* It returns a string from HEX array.
* @param {Array} hash // HEX Array
* @returns {String} // HEX in string
*/
function createHexString(hash) {
  let result = '';

  for (let i = 0; i < hash.length; i += 1) {
    let str = hash[i].toString(16);
    if (str.length === 1) {
      str = `0${str}`;
    }
    result += str;
  }

  return result;
}

export default (passphrase) => {
  const pass = passphrase;
  const hash = sha256.array(pass);

  hash[0] &= 248;
  hash[31] &= 127;
  hash[31] |= 64;

  const privKey = createHexString(hash);
  return privKey;
};
