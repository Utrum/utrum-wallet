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
