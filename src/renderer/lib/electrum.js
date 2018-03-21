import axios from 'axios';

const url = 'http://localhost:8000/';


export default (wallet, testMode) => {
  const payload = {
    ticker: wallet.ticker,
    test: testMode,
    method: 'blockchain.address.get_balance',
    params: [
      wallet.address,
    ],
  };
  return axios.post(url, payload);
};
