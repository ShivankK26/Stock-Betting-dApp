const HDWalletProvider = require('@truffle/hdwallet-provider')
const fs = require('fs')
module.exports = {
  networks: {
    inf_PredictionDap_goerli: {
      network_id: 5,
      gasPrice: 100000000000,
      provider: new HDWalletProvider()
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: '0.8.16',
    },
  },
}
