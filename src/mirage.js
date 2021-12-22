import faker from 'faker'
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
          date: faker.date.recent(30).toISOString(),
          state: "SENT",
        }),

        tx_id(i) {
          return getRandomHash(256)
        },

        asset_id(i) {
          return availableAssets[i % availableAssets.length]
        },

        in() {
          return true // incoming transaction
        },

        date() {
          return faker.date.past().toISOString()
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
        //console.log(txs)
        let assets = []
        txs.forEach(el => {
          let key = el.asset_id
          let index = assets.findIndex(e => e.id === key)
          if (index !== -1) {
            // asset exists already - add tx
            assets[index].txs.push(el)
          }
          else {
            // asset does not exist - create
            assets.push({ id: key, txs: [el] })
          }
        })
        // set quantitiy
        assets.forEach( asset => asset.quantity = asset.txs.reduce((prev, curr) => {
          let a = new Big(prev.amount)
          let b = new Big(curr.amount)
          let fee = curr.fee
          if (curr.in) {
            // incoming transaction
            return { amount: (a.plus(b)).toNumber() } 
          }
          // outgoing transaction
          return { amount: (a.minus(b).minus(fee)).toNumber() } 
        }).amount )
        return assets
      })

      // send
      this.post('/send', function(schema, request) {
        let attrs = JSON.parse(request.requestBody)
        console.log(attrs)
        // TODO: check if tx amount is smaller than balance
        if (attrs.asset_id && attrs.amount && attrs.address) {
          // if no fee is specified use standard one
          let fee = attrs?.fee
          if (!fee) {
            fee = new Big("0.0003")
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

function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
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
