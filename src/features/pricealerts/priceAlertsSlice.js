import {createSlice} from '@reduxjs/toolkit'

const defaultState = []

// load from localstorage
const initialState = localStorage.getItem("priceAlerts") === null ? defaultState: JSON.parse(localStorage.getItem('priceAlerts'))

export const priceAlertsSlice = createSlice({
  name: "pricealerts",
  initialState,
  reducers: {
    newPriceAlert: (state, action) => {
      state.push(action.payload)
    },
    // remove alert by id
    removePriceAlert: (state, action) => {
      let id = action.payload
      let index = state.findIndex(e => e.id === id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    // hide alert by id
    hidePriceAlert: (state, action) => {
      let id = action.payload
      let index = state.findIndex(e => e.id === id)
      if (index !== -1) {
        state[index].hidden = true
      }
    }
  }
})

export const { newPriceAlert, removePriceAlert, hidePriceAlert } = priceAlertsSlice.actions

export default priceAlertsSlice.reducer
