import axios from 'axios';
import bitcoinjs from 'bitcoinjs-lib';
import { Wallet }  from 'libwallet-mnz';

const actions = {
  buyAsset({ commit, rootGetters }, { wallet, amount, fee, coupon }) {
    const walletBuy = wallet;
    const amountBuy = amount;
    const couponBuy = coupon;
    const feeBuy = fee;

    return new Promise((resolve, reject) => {
      axios.post('http://localhost:8000', {
        ticker: walletBuy.ticker,
        test: rootGetters.isTestMode,
        method: 'blockchain.address.listunspent',
        params: [walletBuy.address],
      }).then(response => {

        const wallet = new Wallet(walletBuy.privkey, walletBuy.coin, rootGetters.isTestMode);
        const pubKeysBuy = rootGetters.getPubKeysBuy;
        let pubKeyAddress = '';

        Object.keys(pubKeysBuy).forEach(ticker => {
          if (ticker === walletBuy.ticker.toLowerCase()) {
            pubKeyAddress = pubKeysBuy[ticker];
          }
        });

        const index = Math.floor(Math.random() * 10);
        const xpub = bitcoinjs.HDNode.fromBase58(pubKeyAddress, wallet.coin.network);
        const newAddress = (xpub, index) => {
          return xpub.derivePath(`0/${index}`).keyPair.getAddress();
        };

        const tx = wallet.prepareTx(response.data, newAddress(xpub, index), amountBuy, feeBuy, couponBuy);

        axios.post('http://localhost:8000', {
          ticker: walletBuy.ticker,
          test: rootGetters.isTestMode,
          method: 'blockchain.transaction.broadcast',
          params: [tx],
        }).then((response) => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    });
  },
};


export default {
  actions,
};
