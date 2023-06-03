import { useState, useContext, useEffect } from 'react'
import { STOCKDATA } from '../data/asset.seed'
import truncateEthAddress from 'truncate-eth-address'
const styles = {
  button:
    'rounded-lg py-2 px-5 text-[#ffffff] text-xs border-[#30363b] bg-[#1E2123] border',
  availableBetsContainer: 'flex flex-col mt-4 border-t border-[#30363b] pt-2',
  availableBetsTitle: 'text-[#ffffff] font-bolder text-lg ',
  stockName: 'text-[#ffffff] font-bolder text-lg ml-4',
  noAvailableBetsTitle: 'text-[#ef4b09] font-bold text-sm ',
  availableBetsItem:
    'flex flex-row justify-between items-center border-b border-[#30363b] pb-2',
  currentStockPrice: 'flex flex-col justify-center items-center',
  currentStockPriceTitle: 'text-[8px] text-[#ffffff] mt-4',
  currentStockPriceAmount: 'text-lg text-[#ffffff]',
}

import { useAppContext } from '../context/context'

const AvailableBets = ({ setSelectedBet, setShowModal }) => {
  const { bets } = useAppContext()

  return (
    <div className={styles.availableBetsContainer}>
      <p className={styles.availableBetsTitle}>Bettors</p>
      {bets.map((bet, index) => {
        return (
          <div key={index} className={styles.availableBetsItem}>
            <p className={styles.stockName}>
              Bettor: {truncateEthAddress(bet.address)}
            </p>
            <div className={styles.currentStockPrice}>
              <p className={styles.currentStockPriceTitle}>
                BETS CHANGE WILL BE:
              </p>
              <p className={styles.currentStockPriceAmount}>
                {truncateEthAddress(bet.guess)}
              </p>
            </div>
            <div style={{ flexDirection: 'column', textAlign: 'center' }}>
              <p style={{}} className={styles.currentStockPriceTitle}>
                AMOUNT SENT TO POOL:
              </p>
              <p className={styles.currentStockPriceAmount}>{bet.amount}</p>
            </div>
          </div>
        )
      })}

      {bets.length === 0 && (
        <p className={styles.noAvailableBetsTitle}>No Available Bets</p>
      )}
    </div>
  )
}

export default AvailableBets
