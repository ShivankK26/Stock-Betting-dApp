//Components
import Header from '../components/Header'
import PortfolioChart from '../components/PortfolioChart'

//Icons
import { IoMdArrowDropdown } from 'react-icons/io'

//Dependencies
import { useState, useContext, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { STOCKDATA, CRYPTODATA } from '../data/asset.seed'
import DropDown from '../components/DropDown'
import AvailableBets from '../components/AvailableBets'
import CustomModal from '../components/CustomModal'
import { useAppContext } from '../context/context'
import { createContractObject } from '../utils/contract'
import { toWei } from '../utils/ether-utils'
import { useAccount } from 'wagmi'

//Styles
const styles = {
  wrapper: 'w-screen h-screen flex flex-col',
  mainContainer: 'w-2/3 h-full m-auto flex mt-16',
  leftMain: 'flex flex-col w-3/4 h-full  p-6 overflow-y-scroll',
  portfolioAmountContainer: 'flex flex-col ',
  portfolioAmount: 'text-white text-4xl',
  portfolioPercent: 'text-white font-bold text-sm',
  pastHour: 'text-gray-400',
  chartContainer:
    'text-5xl flex justify-center w-full h-1/3 text-white mt-11 mb-11',
  buyingPowerContainer:
    'w-full border-t   h-16 border-[#30363b] flex justify-between items-center p-4',
  buyingPowerTitle: 'text-white font-bolder text-xl',
  buyingPowerAmount:
    'text-white font-bolder text-xl flex flex-row items-center relative ',
  notice: 'flex border border-[#30363b] mx-11 my-4 p-5 flex-col flex-1',
  noticeContainer: 'flex-1',
  noticeTitle: 'text-gray-500',
  noticeMessage: 'text-white font-bold',
  noticeCTA: 'font-bold text-green-500 cursor-pointer mt-5',
  rightMain:
    'flex flex-col flex-1 h-4/5 bg-[#1E2123] mt-6 rounded-lg overflow-y-scroll noScroll',
  dropDownBets:
    'absolute bg-[#1E2123] border-[#30363b] px-2 py-2 border rounded-xl top-7',
  formButtons: ' w-full flex flex-row justify-center p-2 text-2xl',
  button:
    'rounded-lg py-2 px-16 text-[#ffffff] text-xs border-[#30363b] bg-[#1E2123] border ',
  inputForm: 'flex flex-row mt-4',
  input:
    'rounded-lg px-5 border-[#30363b] bg-[#1E2123] border mx-2 w-3/4 p-1 text-[#ffffff] focus:outline-none',
  availableBetsContainer: 'flex flex-col mt-4 border-t border-[#30363b] pt-2',
  availableBetsTitle: 'text-[#ffffff] font-bolder text-lg ',
  availableBetsItem:
    'flex flex-row justify-between items-center border-b border-[#30363b] pb-2',
  currentStockPrice: 'flex flex-col justify-center items-center',
  currentStockPriceTitle: 'text-[8px] text-[#ffffff] mt-4',
  currentStockPriceAmount: 'text-lg text-[#ffffff]',
}
const Home = () => {
  const [showStockDropDown, setShowStockDropDown] = useState(false)
  const [showAssetDropDown, setShowAssetDropDown] = useState(true)
  const [showBetDropdown, setShowBetDropdown] = useState(false)
  const [guess, setGuess] = useState('')
  const [eth, setEth] = useState('')
  const [selectedBet, setSelectedBet] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [stockName, setStockName] = useState(STOCKDATA[0].name)
  const [availableStock, setAvailableStock] = useState([])

  const {
    currentCoinPrice,
    data,
    setData,
    change,
    percentChange,
    startPrediction,
    lastWinner,
    pool,
    contractOwner,
  } = useAppContext()

  const account = useAccount().address

  const createBet = async () => {
    if (!eth || !guess || !currentCoinPrice) return
    const contract = await createContractObject()
    const amountToSend = toWei(eth, 18)
    const result = await contract.enterBet(guess, {
      value: amountToSend,
      gasLimit: 300000,
    })

    const receipt = await result.wait()
    console.log(receipt)
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      <Toaster position='top-center' reverseOrder={false} />
      <div className={styles.mainContainer}>
        <div className={styles.leftMain}>
          <div className={styles.portfolioAmountContainer}>
            <div className={styles.portfolioAmount}>{data.name}</div>
            <div className={styles.portfolioPercent}>
              {`${change > 0 ? '+' : ''}${change} (${percentChange}%)`}
              <span className={styles.pastHour}>Past Minute</span>
            </div>
          </div>
          <div>
            <div className={styles.chartContainer}>
              <PortfolioChart data={data} />
            </div>
          </div>
          <div className={styles.buyingPowerContainer}>
            <div
              className={styles.buyingPowerAmount}
              onClick={() => setShowBetDropdown(!showBetDropdown)}
            >
              {stockName} <IoMdArrowDropdown />
              {showBetDropdown && (
                <div className={styles.dropDownBets}>
                  {STOCKDATA.filter(data => {
                    let availableBetStockName = availableStock.map(
                      item => item.stockName,
                    )
                    if (!availableBetStockName.includes(data.name)) {
                      return data
                    } else {
                      return
                    }
                  }).map(data => {
                    return (
                      <p
                        key={data.name}
                        onClick={() => {
                          setStockName(data.name)
                          setStockPrice(data.price)
                          setPriceKey(data.priceKey)
                          setData(data)
                        }}
                      >
                        {data.name}
                      </p>
                    )
                  })}
                </div>
              )}
            </div>
            <div className={styles.buyingPowerTitle}>Bet On Stocks</div>
          </div>

          <div className={styles.formButtons}>
            <div>
              <p className='text-[#ffffff]'>
                Current Stock Price: ${currentCoinPrice}
                <br />
                Current Pot: {pool} ETH
                <br />
                {lastWinner && `Last Winner: ${lastWinner}`}
              </p>
            </div>
          </div>
          <form className='flex flex-col'>
            <div className={styles.inputForm}>
              <input
                className={styles.input}
                placeholder={'PREDICTION'}
                type='number'
                required
                onChange={e => {
                  setGuess(e.target.value)
                }}
                value={guess}
              />
              <input
                className={styles.input}
                placeholder={'ETH'}
                type='number'
                required
                onChange={e => {
                  setEth(e.target.value)
                }}
                value={eth}
              />
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}
            >
              <input
                type='submit'
                disabled={availableStock.length === STOCKDATA.length}
                value='Submit'
                className={`${
                  styles.button
                }${' bg-[#ef4b09] w-1/4 text-center mt-8 self-center'}`}
                onClick={e => {
                  e.preventDefault()
                  createBet()
                }}
              />
              <input
                type='submit'
                style={{ textAlign: 'center' }}
                disabled={contractOwner !== account}
                value='(Admin) Start Betting'
                className={`${
                  styles.button
                }${' bg-[#ef4b09] w-1/4 text-center mt-8 self-center'}`}
                onClick={e => {
                  e.preventDefault()
                  startPrediction()
                }}
              />
            </div>
          </form>
          <AvailableBets
            availableStock={availableStock}
            setSelectedBet={setSelectedBet}
            setShowModal={setShowModal}
            data={data}
          />
        </div>
        <div className={styles.rightMain}>
          <DropDown
            data={STOCKDATA}
            setData={setData}
            showDropDown={showAssetDropDown}
            setShowDropDown={setShowAssetDropDown}
            title={'Stocks/Assets'}
          />
          <DropDown
            data={CRYPTODATA}
            setData={setData}
            showDropDown={showStockDropDown}
            setShowDropDown={setShowStockDropDown}
            title={'Crypto Currencies'}
          />
        </div>
      </div>
      <CustomModal
        isOpen={showModal}
        selectedBet={selectedBet}
        setAvailableStock={setAvailableStock}
        setShowModal={setShowModal}
      />
    </div>
  )
}

export default Home
