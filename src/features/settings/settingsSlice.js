import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  display_currency: 'usd',
  darkMode: false
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updatedSettings: (state, action) => {
      return action.payload
    },
    setDisplayCurrency: (state, action) => {
      state.display_currency = action.payload
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    }
  }
})

export const {updatedSettings, setDisplayCurrency, setDarkMode} = settingsSlice.actions

export default settingsSlice.reducer