import { createServer, Factory, Model, trait } from 'miragejs'
import Big from 'big.js'

export const startMirage = () => {

  const availableAssets = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin']

  return createServer({

    models: {
      transaction: Model,
      address: Model
    },

    factories: {
      
      transaction: Factory.extend({

        txOut: trait({
          in: false,
          date: getRandomDate(30).toISOString(),
          state: "SENT",
        }),

        tx_id(i) {
          return getRandomHash(32)
        },

        asset_id(i) {
          return availableAssets[i % availableAssets.length]
        },

        in() {
          return true // incoming transaction
        },

        date() {
          return getRandomDate(365).toISOString()
        },

        amount(i) {
          return 1
        },

        fee() {
          return 0.0003
        },

        state(i) {
          return "RECEIVED"
        },

        afterCreate(transaction, server) {
          let attrs = transaction.attrs
          // adjust tx amounts
          let asset = attrs.asset_id 
          if (attrs.in) {
            switch (asset) { 
              case "bitcoin":
                transaction.update({ amount: getRandomBitcoinAmount() })
                break
              case "ethereum":
                transaction.update({ amount: getRandomEthereumAmount() })
                break
              case "litecoin":
                transaction.update({ amount: getRandomLitecoinAmount() })
                break
              case "monero":
                transaction.update({ amount: getRandomMoneroAmount() })
                break
              case "dogecoin":
                transaction.update({ amount: getRandomDogecoinAmount() })
                break
            }
          }
          else {
            switch (asset) {
              case "bitcoin":
                transaction.update({ amount: (getRandomBitcoinAmount() / 10).toFixed(6) })
                break
              case "ethereum":
                transaction.update({ amount: (getRandomEthereumAmount() /10).toFixed(4) })
                break
              case "litecoin":
                transaction.update({ amount: (getRandomLitecoinAmount() / 10).toFixed(4) })
                break
              case "monero":
                transaction.update({ amount: (getRandomMoneroAmount() / 10).toFixed(4) })
                break
              case "dogecoin":
                transaction.update({ amount: (getRandomDogecoinAmount() / 10).toFixed(2) })
                break
            }
          }
        }
      }),

    },
    

    seeds(server) {
      server.createList("transaction", 60)
      server.createList("transaction", 20, "txOut")
    },

    routes() {
      // allow access to coingecko
      this.passthrough('https://api.coingecko.com/**')

      this.namespace = "api"

      this.get('/transactions') 

      this.get('/transactions/:asset', (schema, request) => {
        let asset = request.params.asset

        if (asset) {
          return schema.transactions.where(tx => tx.asset === asset)
        }

        return schema.transactions.all()
      })

      this.get('/assets', function(schema, request) {
        let txsCollection = schema.transactions.all()
        let txs = this.serialize(txsCollection).transactions

        const assets = availableAssets.map( asset => {
          return { 'id': asset, 'txs': txs.filter( tx => tx.asset_id === asset ) } 
        })
        // set quantitiy
        assets.map( asset => asset.quantity = getBalance(asset.txs) )
        return assets
      })

      // send
      this.post('/send', function(schema, request) {
        let attrs = JSON.parse(request.requestBody)
        console.log(attrs)
        if (attrs.asset_id && attrs.amount && attrs.address) {
          const asset = attrs.asset_id
          const txs = this.serialize(schema.transactions.where(e => e.asset_id === asset)).transactions
          let balance = getBalance(txs)
          // if no fee is specified use standard one
          let fee = attrs.fee
          if (!fee) {
            fee = new Big("0.0003")
          }
          else {
            fee = new Big(attrs.fee)
          }
          // check if balance is sufficient
          let amount = new Big(attrs.amount)
          if (amount.plus(fee).gt(balance)) {
            return new Response( 400, { some: "header"}, { errors: ["Balance is insufficient"]})
          }
          // create new transaction
          let tx = {
            asset_id: attrs.asset_id,
            address: attrs.address,
            amount: attrs.amount,
            fee: fee,
            tx_id: getRandomHash(),
            date: new Date().toISOString(),
            in: false,
            state: "PENDING"
          }

          return schema.transactions.create(tx)
        }
        else {
          return new Response(
            400,
            { some: "header" },
            { errors: ["Missing attributes"] }
          )
        }
      })

    },

  })
}

/**
 * @param txs array containing all transactions of the asset
 * @returns the balance of the asset
 */
function getBalance(txs) {
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

function getRandomBitcoinAmount() {
  return Number(getRandomBetween(0.01, 0.02).toFixed(6))
}

function getRandomEthereumAmount() {
  return Number(getRandomBetween(0.25, 0.5).toFixed(4))
}

function getRandomLitecoinAmount() {
  return Number(getRandomBetween(10, 16).toFixed(4))
}

function getRandomMoneroAmount() {
  return Number(getRandomBetween(4, 6).toFixed(4))
}

function getRandomDogecoinAmount() {
  return Number(getRandomBetween(1000, 2000).toFixed(2))
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
