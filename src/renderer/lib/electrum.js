import sb from 'satoshi-bitcoin'
import axios from 'axios'

const url = `http://localhost:8000/`


export const getBalance = function(wallet, testMode) {
  let payload = {
    "ticker": wallet.ticker,
    "test": testMode,
    "method":"blockchain.address.get_balance",
    "params": [
      wallet.address
    ]
  }
  return axios.post(url, payload)
}

