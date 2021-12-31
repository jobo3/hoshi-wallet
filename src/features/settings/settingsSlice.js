import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  displayCurrency: 'usd',
  darkMode: false,
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
    }
  }
})

export const {updatedSettings, setDisplayCurrency, setDarkMode } = settingsSlice.actions

export default settingsSlice.reducer