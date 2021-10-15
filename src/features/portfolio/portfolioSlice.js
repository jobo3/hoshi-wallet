import {createSlice} from '@reduxjs/toolkit'

const initialState = null

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updatedPortfolio: (state, action) => {
      return action.payload
    },
  }
})

export const {updatedPortfolio} = portfolioSlice.actions

export default portfolioSlice.reducer