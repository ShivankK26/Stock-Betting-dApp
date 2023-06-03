const StockPrediction = artifacts.require('StockPrediction')

module.exports = function (deployer) {
  deployer.deploy(StockPrediction)
}
