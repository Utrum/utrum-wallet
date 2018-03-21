import axios from 'axios';

export default (currency) => {
  return axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/`);
};

