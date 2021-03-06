import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import "bootstrap-icons/font/bootstrap-icons.css"
import store from './app/store'
import { Provider } from 'react-redux'

store.subscribe(() => {
  let state = store.getState()
  try {
    // save settings and portfolio
    localStorage.setItem('settings', JSON.stringify(state.settings))
    localStorage.setItem('portfolio', JSON.stringify(state.portfolio))
    localStorage.setItem('priceAlerts', JSON.stringify(state.priceAlerts))
  } catch(error) {
    console.error(error)
  }
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        < App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
