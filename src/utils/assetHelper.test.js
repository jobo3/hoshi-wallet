import { sum } from 'lodash'
import AssetHelper, { getBalance } from './assetHelper'


it('shows correct balance', () => {
  const testTxs = [{
    "state": "RECEIVED",
    "fee": 0.0003,
    "amount": 0.012,
    "date": "2021-07-06T00:42:15.489Z",
    "in": true,
    "asset_id": "bitcoin",
    "tx_id": "046458384455e6739f66bb28805dc278"
  },
  {
    "state": "RECEIVED",
    "fee": 0.0003,
    "amount": 0.013,
    "date": "2021-05-19T02:57:45.982Z",
    "in": true,
    "asset_id": "bitcoin",
    "tx_id": "da9025a46b3b1bcd6d6ac5296447c77d"
  }]
  expect(getBalance(testTxs)).toEqual(sum(testTxs.map(e => e.amount)))
})

it('generates transactions', () => {
  const allTxs = AssetHelper.generateTransactions()
  expect(allTxs.length).toEqual(160)
})

it('creates assets correctly', () => {
  const assets = AssetHelper.generateInitialAssets()
  expect(assets.length).toEqual(AssetHelper.availableAssets.length)
})
