import { isAfter, sub } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'


/**
 * @param now - date object
 * @param asset - coingecko marketdata element
 * @param priceAlerts - array containing price alert objects
 * @param maxPriceChange24h - threshold to trigger 24h alert
 * @param maxPriceChange7d - threshold to trigger 7d alert
 * @param callback - callback which will be called when a price alert has been triggered
 */
export const checkPriceAlerts = (now, asset, priceAlerts, maxPriceChange24h, maxPriceChange7d, callback) => {
   // 24 hours price alerts
   let priceChange24h = asset.price_change_percentage_24h
   if (Math.abs(priceChange24h) > maxPriceChange24h) {
     let todayMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
     let currentAssetPriceAlerts = priceAlerts.filter(e => e.asset_id === asset.id && e.days === 1)
     // has there already been a price alert for this asset today?
     let oldAlert = currentAssetPriceAlerts.find(e => {
       let alertDate = new Date(e.date)
       return isAfter(alertDate, todayMidnightUTC)
     })
     if (oldAlert === undefined) {
       let alert = {
         id: uuidv4(),
         asset_id: asset.id,
         asset_name: asset.name,
         price_change: priceChange24h,
         date: now.toISOString(),
         days: 1, // time period
         hidden: false
       }
       callback(alert)
     }
   }
   // 7 days price alerts
   let sparklinePrices = asset.sparkline_in_7d.price
   let priceChange7days = (sparklinePrices[sparklinePrices.length-1] - sparklinePrices[0]) / asset.current_price * 100
   if (Math.abs(priceChange7days) > maxPriceChange7d) {
     let lastWeek = sub(now, {days: 7})
     let currentAssetPriceAlerts = priceAlerts.filter(e => e.asset_id === asset.id && e.days === 7)
     // was there a price alert for this asset in the last 7 days?
     let oldAlert = currentAssetPriceAlerts.find(e => {
       let alertDate = new Date(e.date)
       return isAfter(alertDate, lastWeek)
     })
     if (oldAlert === undefined) {
       let alert = {
         id: uuidv4(),
         asset_id: asset.id,
         asset_name: asset.name,
         price_change: priceChange7days,
         date: now.toISOString(),
         days: 7, // time period
         hidden: false
       }
       callback(alert)
     }
   }
}
