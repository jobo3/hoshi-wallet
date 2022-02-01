import {createSlice} from '@reduxjs/toolkit'
import { add, isPast } from 'date-fns'
import { generateInitialAssets, getBalance } from '../../utils/assetHelper'

// load initial state from localstorage, else generate initial portfolio
const initialState = localStorage.getItem("portfolio") === null ? generateInitialAssets() : JSON.parse(localStorage.getItem('portfolio'))

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updatedPortfolio: (state, action) => {
      return action.payload
    },
    newTx: (state, action) => {
      let tx = action.payload
      let index = state.findIndex(e => e.id === tx.asset_id)
      if (index !== -1)  {
        state[index].txs.push(tx)
        const txs = state[index].txs
        state[index].quantity = getBalance(txs)
      }
    },
    updateTxs: (state, action) => {
      let shouldUpdateBalance = false
      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          const asset = state[key]
          for (let i=0; i < asset.txs.length; i++) {
            let tx = asset.txs[i]
            if (tx.state === 'PENDING') {
              if (isPast(add(new Date(tx.date), {minutes: 2}))) {
                // set state
                if (tx.incoming) {
                  state[key].txs[i].state = 'RECEIVED'
                }
                else {
                  state[key].txs[i].state = 'SENT'
                }
                shouldUpdateBalance = true
              }
            }
          }
        }
      }
      if (shouldUpdateBalance) {
        for (const key in state) {
          if (state.hasOwnProperty(key)) {
            const txs = state[key].txs
            state[key].quantity = getBalance(txs)
          }
        }
      }
    }
  }
})

export const {updatedPortfolio, newTx, updateTxs} = portfolioSlice.actions

export default portfolioSlice.reducer
