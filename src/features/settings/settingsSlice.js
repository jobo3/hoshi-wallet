import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  displayCurrency: 'usd',
  darkMode: false,
  mnemonic: null
}

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
