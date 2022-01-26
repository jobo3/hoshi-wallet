import {createSlice} from '@reduxjs/toolkit'
import Big from 'big.js'
import { generateInitialAssets } from '../../utils/assetHelper'

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
        // update quantity
        let balance = new Big(state[index].quantity)
        let amount = new Big(tx.amount)
        let fee = new Big(tx.fee)
        if (tx.incoming) balance = balance.add(amount)
        else balance = balance.minus(amount).minus(fee)
        state[index].quantity = balance.toNumber()
      }
    }
  }
})

export const {updatedPortfolio, newTx} = portfolioSlice.actions

export default portfolioSlice.reducer
