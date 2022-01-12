import {createSlice} from '@reduxjs/toolkit'

const initialState = null

export const marketDataSlice = createSlice({
  name: "marketData",
  initialState,
  reducers: {
    updatedMarketData: (state, action) => {
      return action.payload
    }
  },
})


export const { updatedMarketData } = marketDataSlice.actions

export default marketDataSlice.reducer
