import { isAfter, sub } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

// price change in percentage, which will trigger an alert
export const MAX_PRICE_CHANGE_24H = 3
export const MAX_PRICE_CHANGE_7D = 20

/**
 * @param now - date object
 * @param asset - coingecko marketdata element
 * @param priceAlerts - array containing price alert object
 * @param callback - callback which will be called when a price alert has been triggered
 */
export const checkPriceAlerts = (now, asset, priceAlerts, callback) => {
   // 24 hours price alerts
   let priceChange24h = asset.price_change_percentage_24h
   if (Math.abs(priceChange24h) > MAX_PRICE_CHANGE_24H) {
     let yesterday = sub(now, {days: 1})
     let currentAssetPriceAlerts = priceAlerts.filter(e => e.asset_id === asset.id && e.days === 1)
     // was there a price alert for this asset in the last 24 hours?
     let oldAlert = currentAssetPriceAlerts.find(e => {
       return isAfter(new Date(e.date), yesterday)
     })
     if (oldAlert === undefined) {
       let alert = {
         id: uuidv4(),
         asset_id: asset.id,
         asset_name: asset.name,
         price_increased: Math.sign(priceChange24h) === 1 ? true : false,
         price_change: priceChange24h,
         date: new Date().toISOString(),
         days: 1, // time period
         hidden: false
       }
       callback(alert)
     }
   }
   // 7 days price alerts
   let sparklinePrices = asset.sparkline_in_7d.price
   let priceChange7days = (sparklinePrices[sparklinePrices.length-1] - sparklinePrices[0]) / asset.current_price * 100
   if (Math.abs(priceChange7days) > MAX_PRICE_CHANGE_7D) {
     let lastWeek = sub(now, {days: 7})
     let currentAssetPriceAlerts = priceAlerts.filter(e => e.asset_id === asset.id && e.days === 7)
     // was there a price alert for this asset in the last 7 days?
     let oldAlert = currentAssetPriceAlerts.find(e => {
       return isAfter(new Date(e.date), lastWeek)
     })
     if (oldAlert === undefined) {
       let alert = {
         id: uuidv4(),
         asset_id: asset.id,
         asset_name: asset.name,
         price_increased: Math.sign(priceChange7days) === 1 ? true : false,
         price_change: priceChange7days,
         date: new Date().toISOString(),
         days: 7, // time period
         hidden: false
       }
       callback(alert)
     }
   }
}
