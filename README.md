# Utrum Wallet

Official "Utrum (OOT) Wallet" based on Electrum.

OOT/ KMD / BTC wallet with basic features: balances, withdrawals & history.

HODL feature for earning rewards of OOT coin.

#### Build Setup

``` bash
## (npm and yarn friendly)

# install dependencies
cd utrum-wallet && yarn install

# serve with hot reload at localhost:9080
yarn run start-prod-internal

# build electron application for production on your current platform
yarn run build-prod-internal

# run unit tests
yarn test

```
#### Troubleshooting

Error in Ubuntu while running build-prod-internal "ERROR: [Errno 2] No such file or directory: 'install'"

To solve this, do the following commands:

``` bash
sudo apt remove cmdtest
sudo apt remove yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

```

#### Contributions

This wallet is based on the work of the Monaize team.

If you find a bug or you want to propose a feature, you should create an [issue](https://github.com/Utrum/utrum-wallet/issues/new) on Github.

#### Software license

The Utrum Wallet repository is licensed under the GNU General Public License v3.0, also included in our repository in the [COPYING](https://gitlab.com/Utrum/utrum-wallet/blob/master/LEGAL/COPYING) file.
