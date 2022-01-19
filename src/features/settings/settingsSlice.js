import {createSlice} from '@reduxjs/toolkit'

const defaultState = {
  displayCurrency: 'usd',
  darkMode: false,
  mnemonic: null
}

// load from localstorage
const initialState = localStorage.getItem("settings") === null ?  defaultState: JSON.parse(localStorage.getItem('settings'))

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updatedSettings: (_state, action) => {
      return action.payload
    },
    setDisplayCurrency: (state, action) => {
      state.displayCurrency = action.payload
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    },
    setMnemonic: (state, action) => {
      state.mnemonic = action.payload
    }
  }
})

export const {updatedSettings, setDisplayCurrency, setDarkMode, setMnemonic } = settingsSlice.actions

export default settingsSlice.reducer
