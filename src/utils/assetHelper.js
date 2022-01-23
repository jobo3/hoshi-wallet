import Big from 'big.js'

/**
 * @param txs array containing all transactions of the asset
 * @returns the balance of the asset
 */
 export function getBalance(txs) {
  let balance = new Big('0')
  txs.forEach( tx => {
    let amount = new Big(tx.amount)
    let fee = new Big(tx.fee)
    if (tx.in) balance = balance.add(amount)
    else balance = balance.minus(amount).minus(fee)
  })
  return balance.toNumber()
}

function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function getRandomTxAmount(asset) {
  switch(asset) {
    case 'bitcoin': return Number(getRandomBetween(0.01, 0.02).toFixed(6))
    case 'ethereum': return Number(getRandomBetween(0.25, 0.5).toFixed(4))
    case 'litecoin': return Number(getRandomBetween(10, 16).toFixed(4))
    case 'dogecoin': return Number(getRandomBetween(1000, 2000).toFixed(2))
    default: return Number(getRandomBetween(0.01, 0.02).toFixed(6))
  }
}

function getRandomHash(n) {
  let characters = "0123456789abcdef"
  let hash = ""
  for (let i = 0; i < n; i++) {
    hash += characters[Math.floor(Math.random() * 16)]
  }
  return hash
}

function getRandomInteger(min, max) {
  return Math.floor(getRandomBetween(min, max))
}

function getRandomDate(days) {
  let min = 1000
  let max = 1000 * 60 * 60 * 24 * days
  let now = new Date().getTime()
  return new Date(now - getRandomInteger(min, max))
}

/**
 * This class provides functions to generate transactions 
 */
export default class AssetHelper {

  static availableAssets = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin']

  // object containing asset -> average tx fee mapping
  static txFeeMap = {
    'bitcoin': 0.000008,
    'ethereum': 0.005,
    'litecoin': 0.00001,
    'dogecoin': 1
  }

  static getTxFee(asset) {
    let fee = this.txFeeMap[asset]
    return fee !== undefined ? fee : 0.000008
  }

  static generateIncomingTransactions(asset, n) {
    let incomingTxs = []
    for (let i = 0; i < n; i++) {
      let tx = {
        "state": "RECEIVED",
        "fee": this.getTxFee(asset),
        "amount": getRandomTxAmount(asset),
        "date": getRandomDate(365).toISOString(),
        "in": true,
        "asset_id": asset,
        "tx_id": getRandomHash(32)
      }
      incomingTxs.push(tx)
    }

    return incomingTxs
  }

  static generateOutgoingTransactions(asset, n) {
    let outgoingTxs = []
    for (let i = 0; i < n; i++) {
      let tx = {
        "state": "SENT",
        "fee": this.getTxFee(asset),
        "amount": Number(new Big(getRandomTxAmount(asset)).div(new Big(10)).toFixed(5)),
        "date": getRandomDate(30).toISOString(),
        "in": false,
        "asset_id": asset,
        "tx_id": getRandomHash(32)
      }
      outgoingTxs.push(tx)
    }

    return outgoingTxs
  }

  static generateTransactions() {
    const allTxs = []
    this.availableAssets.forEach(function(asset) {
      allTxs.push(...this.generateIncomingTransactions(asset, 30))
      allTxs.push(...this.generateOutgoingTransactions(asset, 10))
    }, this)
    return allTxs
  }

  // orders transactions
  static getAssets(txs) {
    const assets = this.availableAssets.map( asset => {
      return { 'id': asset, 'txs': txs.filter( tx => tx.asset_id === asset ) } 
    })
    // set quantitiy
    assets.map( asset => asset.quantity = getBalance(asset.txs) )
    return assets
  }

  static generateInitialAssets() {
    return this.getAssets(this.generateTransactions())
  }

  // creates a new outgoing transaction when the user "sends" coins to some address
  static createTransaction(balance, tx) {
    if (tx.asset_id && tx.amount && tx.address) {
      // if no fee is specified use standard one
      let fee = tx.fee
      if (!fee) {
        fee = this.getTxFee(tx.asset_id)
      }
      // check if balance is sufficient
      let amount = new Big(tx.amount)
      if (amount.plus(fee).gt(balance)) {
        throw "Balance is insufficient"
      }
      // create new transaction
      let newTx = {
        asset_id: tx.asset_id,
        address: tx.address,
        amount: tx.amount,
        fee: fee,
        tx_id: getRandomHash(32),
        date: new Date().toISOString(),
        in: false,
        state: "PENDING"
      }

      return newTx
    }
  }

  // create incoming tx
  static createIncomingTransaction(tx) {
    if (tx.asset_id && tx.amount && tx.address) {
      // if no fee is specified use standard one
      let fee = tx.fee
      if (!fee) {
        fee = this.getTxFee(tx.asset_id)
      }

      // create new transaction
      let newTx = {
        asset_id: tx.asset_id,
        address: tx.address,
        amount: tx.amount,
        fee: fee,
        tx_id: getRandomHash(32),
        date: new Date().toISOString(),
        in: true,
        state: "PENDING"
      }

      return newTx
  }
}

}
