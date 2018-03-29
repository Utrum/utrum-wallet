import axios from 'axios';
import getTxFromRawTx from '../../lib/txtools';

const actions = {
  addTxLocal({ commit }, { walletBuy, txHash, amountBuy, amountMnzBuy }) {
    const txLocalBuy = {
      address: walletBuy.address,
      amount: amountBuy,
      fromMnz: true,
      height: -42,
      time: new Date().getTime() / 1000,
      tx_hash: txHash,
    };
    const txLocalMnz = {
      address: '',
      amount: amountMnzBuy,
      fromMnz: true,
      height: -42,
      origin: {
        ticker: walletBuy.ticker,
        txHash: txHash.substring(0, 9),
      },
      time: new Date().getTime() / 1000,
      tx_hash: '',
    };
    commit('ADD_TX', { ticker: walletBuy.ticker, tx: txLocalBuy }, { root: true });
    commit('ADD_TX', { ticker: 'MNZ', tx: txLocalMnz }, { root: true });
  },
  getRawTx({ commit, rootGetters }, { ticker, tx }) {
    const payload = {
      ticker: ticker,
      test: rootGetters.isTestMode,
      method: 'blockchain.transaction.get',
      params: [tx.tx_hash, 1],
    };
    return axios.post('http://localhost:8000', payload);
  },
  decodeTx({ commit, dispatch, rootGetters, rootState }, { wallet, tx }) {
    const txExists = rootGetters.getWallets[wallet.ticker].txs.map(t => {
      return t.tx_hash;
    }).indexOf(tx.tx_hash);

    if (txExists < 0) {
      dispatch('getRawTx', { ticker: wallet.ticker, tx: tx }).then(response => {
        const verboseTx = getTxFromRawTx(wallet, response.data, tx.height, rootGetters.isTestMode);
        // const pendingTxs = wallet.txs.filter(el => (el.height === 0 || el.height === -1));
        // const localTxs = wallet.txs.filter(el => el.height === -42);

        // console.log(pendingTxs)

        commit('ADD_TX', { ticker: wallet.ticker, tx: verboseTx }, { root: true });
      });
    }
  },
  buildTxHistory({ commit, dispatch, getters, rootGetters }, wallet) {
    axios.post('http://localhost:8000', {
      ticker: wallet.ticker,
      test: rootGetters.isTestMode,
      method: 'blockchain.address.get_history',
      params: [wallet.address],
    }).then(response => {
      if (response.data.length > 0) {
        const txs = response.data;

        txs.forEach(tx => {
          dispatch('decodeTx', { wallet: wallet, tx: tx });
        });
      }
    });
  },
};

export default {
  actions,
};

