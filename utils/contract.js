import { ethers } from 'ethers'
import StockBet from './StockPrediction.json'

// create a function that initializes the contract object
export async function createContractObject() {
  // get the provider and signer
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  // create the contract object using the ABI and contract address
  const contract = new ethers.Contract(
    '0x63B2F9b1432D4128ceE6F843177ffe05114b5c95',
    StockBet.abi,
    signer,
  )

  return contract
}
