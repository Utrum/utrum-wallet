import sb from 'satoshi-bitcoin'
import axios from 'axios'

const url = `http://localhost:8000/`


export const getBalance = function(wallet) {
  let payload = {
    "ticker": wallet.ticker,
    "method":"blockchain.address.get_balance",
    "params": [
      wallet.address
    ]
  ***REMOVED***
  return axios.post(url, payload)
***REMOVED***

