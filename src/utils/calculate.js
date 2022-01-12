import Big from 'big.js'

/* 
  Calculates the current portfolio value,
  argument is an array containing quantity and marketdata of crypto assets
*/
export const totalPortfolioValue = (portfolioData) => {
  return portfolioData.reduce((acc, asset) => {
    let price = new Big(asset.market_data.current_price)
    let quantitiy = new Big(asset.quantity)
    let value = quantitiy.times(price)
    return (new Big(acc)).plus(value).toNumber()
  }, 0)
}

/* 
  Portfolio value 24 hours ago,
  argument is an array containing quantity and marketdata of crypto assets
*/
export const totalPortfolioValue24hAgo = (portfolioData) => {
  return portfolioData.reduce((acc, asset) => {
    let oldPrice = (new Big(asset.market_data.current_price)).minus(new Big(asset.market_data.price_change_24h))
    let quantitiy = new Big(asset.quantity)
    let value = quantitiy.times(oldPrice)
    return (new Big(acc)).plus(value).toNumber()
  }, 0)
}

export const totalPortfolioValueChangePercentage24h = (portfolioData) => {
  let currentPortfolioValue = new Big(totalPortfolioValue(portfolioData))
  let portfolioValue24hAgo = new Big(totalPortfolioValue24hAgo(portfolioData))
  try {
    // possible division by zero
    let result = (currentPortfolioValue.minus(portfolioValue24hAgo)).div(portfolioValue24hAgo).times(100).toNumber()
    return result
  }
  catch (error) {
    return NaN
  }
}
