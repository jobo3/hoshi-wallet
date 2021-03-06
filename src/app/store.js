import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer from '../features/portfolio/portfolioSlice'
import marketDataReducer from '../features/marketdata/marketDataSlice'
import settingsSliceReducer from '../features/settings/settingsSlice'
import priceAlertsReducer from '../features/pricealerts/priceAlertsSlice'

export default configureStore({
  reducer: {
    portfolio: portfolioReducer,
    marketData: marketDataReducer,
    settings: settingsSliceReducer,
    priceAlerts: priceAlertsReducer
  },
})
