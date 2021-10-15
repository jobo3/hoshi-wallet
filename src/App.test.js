import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './app/store'
import { startMirage } from './mirage';


let server

beforeAll(() => {
  // start mirage mock API
  server = startMirage()
  // allow access to coingecko
  server.passthrough('https://api.coingecko.com/**')
  // disable logging
  server.logging = false
})


afterAll(() => {
  server.shutdown()
})


it('renders wallet', async () => {
  render(<Provider store={store}><App /></Provider>)
  const walletElements = screen.getAllByText(/Wallet/)
  const walletElement = walletElements[0]
  expect(walletElement).toBeInTheDocument()
});

it('renders bitcoin holding', async () => {
  render(<Provider store={store}><App /></Provider>)
  const bitcoinEl = await screen.findByText(/Bitcoin/)
  expect(bitcoinEl).toBeInTheDocument()
})
