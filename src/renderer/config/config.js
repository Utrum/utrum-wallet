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

const _        = require('lodash');

const env      = process.env.WALLET_ENV || 'dev';

const techBase = require('../../../config/tech/base');
const funcBase = require('../../../config/func/base');

const techExt  = require(`../../../config/tech/${env}`);
const funcExt  = require(`../../../config/func/${env}`);

const tech     = _.merge(techBase, techExt);
const func     = _.merge(funcBase, funcExt);

module.exports = {
  tech,
  func,
  env,
};
