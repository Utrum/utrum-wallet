import axios from 'axios'

export const getCmcData =  function(currency) {
  return axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/`);
}
