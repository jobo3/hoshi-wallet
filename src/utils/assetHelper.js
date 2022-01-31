import Big from 'big.js'

// assets that are supported by the wallet
export const AVAILABLE_ASSETS = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin']

/**
 * @param txs array containing all transactions of the asset
 * @returns the balance of the asset
 */
 export function getBalance(txs) {
  let balance = new Big('0')
  txs.forEach( tx => {
    let amount = new Big(tx.amount)
    let fee = new Big(tx.fee)
    if (tx.incoming) balance = balance.add(amount)
    else balance = balance.minus(amount).minus(fee)
  })
  return balance.toNumber()
}

export function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export function getRandomTxAmount(asset) {
  switch(asset) {
    case 'bitcoin': return Number(getRandomBetween(0.01, 0.02).toFixed(6))
    case 'ethereum': return Number(getRandomBetween(0.25, 0.5).toFixed(4))
    case 'litecoin': return Number(getRandomBetween(10, 16).toFixed(4))
    case 'dogecoin': return Number(getRandomBetween(1000, 2000).toFixed(2))
    default: return Number(getRandomBetween(0.01, 0.02).toFixed(6))
  }
}

export function getRandomHash(n) {
  let characters = "0123456789abcdef"
  let hash = ""
  for (let i = 0; i < n; i++) {
    hash += characters[Math.floor(Math.random() * 16)]
  }
  return hash
}

export function getRandomInteger(min, max) {
  return Math.floor(getRandomBetween(min, max))
}

export function getRandomDate(days) {
  let min = 1000
  let max = 1000 * 60 * 60 * 24 * days
  let now = new Date().getTime()
  return new Date(now - getRandomInteger(min, max))
}

export function roundAssetDown(number, fractionDigits) {
  return Math.floor(number*Math.pow(10,fractionDigits)) / Math.pow(10,fractionDigits)
}

// for Send component
export function getAmountStep(asset) {
  // switch(asset) {
  //   case 'bitcoin': return '0.0001'
  //   case 'ethereum': return '0.001'
  //   case 'litecoin': return '0.1'
  //   case 'dogecoin': return '10'
  //   default: return '0.0001'
  // }
  return '0.00000001'
}

export function getTxFeeStep(asset) {
  // switch(asset) {
  //   case 'bitcoin': return '0.000001'
  //   case 'ethereum': return '0.001'
  //   case 'litecoin': return '0.00001'
  //   case 'dogecoin': return '1'
  //   default: return '0.0001'
  // }
  return '0.00000001'
}

// object containing asset -> average tx fee mapping
export const txFeeMap = {
  'bitcoin': 0.000008,
  'ethereum': 0.005,
  'litecoin': 0.00001,
  'dogecoin': 1
}

export function getTxFee(asset) {
  let fee = txFeeMap[asset]
  return fee !== undefined ? fee : 0.000008
}

export function generateIncomingTransactions(asset, n) {
  let incomingTxs = []
  for (let i = 0; i < n; i++) {
    let tx = {
      state: "RECEIVED",
      fee: getTxFee(asset),
      amount: getRandomTxAmount(asset),
      date: getRandomDate(365).toISOString(),
      incoming: true,
      asset_id: asset,
      tx_id: getRandomHash(32)
    }
    incomingTxs.push(tx)
  }

  return incomingTxs
}

export function generateOutgoingTransactions(asset, n) {
  let outgoingTxs = []
  for (let i = 0; i < n; i++) {
    let tx = {
      state: "SENT",
      fee: getTxFee(asset),
      amount: Number(new Big(getRandomTxAmount(asset)).div(new Big(10)).toFixed(5)),
      date: getRandomDate(30).toISOString(),
      incoming: false,
      asset_id: asset,
      tx_id: getRandomHash(32)
    }
    outgoingTxs.push(tx)
  }

  return outgoingTxs
}

export function generateTransactions() {
  const allTxs = []
  AVAILABLE_ASSETS.forEach(function(asset) {
    allTxs.push(...generateIncomingTransactions(asset, 30))
    allTxs.push(...generateOutgoingTransactions(asset, 10))
  })
  return allTxs
}

// orders transactions
export function getAssets(txs) {
  const assets = AVAILABLE_ASSETS.map( asset => {
    return { 'id': asset, 'txs': txs.filter( tx => tx.asset_id === asset ) } 
  })
  // set quantitiy
  assets.map( asset => asset.quantity = getBalance(asset.txs) )
  return assets
}

// this function is used to generate some initial transaction and balances
export function generateInitialAssets() {
  return getAssets(generateTransactions())
}

// creates a new outgoing transaction when the user "sends" coins to some address
export function createOutgoingTransaction(balance, tx) {
  if (tx.asset_id && tx.amount && tx.address) {
    // if no fee is specified use standard one
    let fee = tx.fee
    if (!fee) {
      fee = getTxFee(tx.asset_id)
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
      incoming: false,
      state: "PENDING"
    }

    return newTx
  }
}

// create incoming tx
export function createIncomingTransaction(tx) {
  if (tx.asset_id && tx.amount && tx.address) {
    // if no fee is specified use standard one
    let fee = tx.fee
    if (!fee) {
      fee = getTxFee(tx.asset_id)
    }

    // create new transaction
    let newTx = {
      asset_id: tx.asset_id,
      address: tx.address,
      amount: tx.amount,
      fee: fee,
      tx_id: getRandomHash(32),
      date: new Date().toISOString(),
      incoming: true,
      state: "PENDING"
    }

    return newTx
  }
}
