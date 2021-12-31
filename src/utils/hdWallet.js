// The MIT License (MIT)
// 
// Copyright (c) 2021 Hoshi wallet
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// Parts of this file are originally copyright (c) 2011-2020 bitcoinjs-lib contributors or 2014-2016 Ian Coleman

import BIP32Factory from 'bip32'
import {Buffer} from 'buffer'
import * as ecc from 'tiny-secp256k1'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import EthWallet from 'ethereumjs-wallet'

const bip32 = BIP32Factory(ecc)

function getAddress(node, network) {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

function getSegwitAddress(node, network) {
  return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address
}

export default class HDWallet {

  constructor(mnemonic) {
    this.mnemonic = mnemonic
    this.seed = bip39.mnemonicToSeedSync(mnemonic)
    this.root = bip32.fromSeed(this.seed)
  }

  getMnemonic() {
    return this.mnemonic
  }

  static generate() {
    // 128 bits entropy for 12 word mnemonic, 256 bits for 24 words
    let array = new Uint8Array(16) // 16 bytes = 128 bits
    crypto.getRandomValues(array)
    const buffer = Buffer.from(array)
    const mnemonic = bip39.entropyToMnemonic(buffer)
    console.log(mnemonic)
    return new HDWallet(mnemonic)
  }

  /** 
   * @param account - index of account
   * @param chain - 0 for external and 1 for internal (change address)
   * @param index - index of address
   */
  getBtcAddress(account=0, chain=0, index=0) {
    const coin = 0 // 0 for Bitcoin
    const node = this.root.derivePath(`m/44'/${coin}'/${account}'/${chain}/${index}`)
    return getSegwitAddress(node)
  }
  
   getEthAddress(account=0, chain=0, index=0) {
    const coin = 60 // 60 for Ethereum
    const node = this.root.derivePath(`m/44'/${coin}'/${account}'/${chain}/${index}`)
    const xpriv = node.toBase58()
    return EthWallet.fromExtendedPrivateKey(xpriv).getAddressString()
  }

  getLtcAddress(account=0, chain=0, index=0) {
    const coin = 2 // 2 for Litecoin
    const node = this.root.derivePath(`m/44'/${coin}'/${account}'/${chain}/${index}`)
    // litecoin network parameters https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
    const litecoin = {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bech32: 'ltc',
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0,
    }
    return getSegwitAddress(node, litecoin)
  }

  getDogeAddress(account=0, chain=0, index=0) {
    const coin = 3 // 3 for Dogecoin
    const node = this.root.derivePath(`m/44'/${coin}'/${account}'/${chain}/${index}`)
    // https://github.com/iancoleman/bip39/blob/master/src/js/bitcoinjs-extensions.js
    const dogecoin = {
      messagePrefix: '\x19Dogecoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x02facafd,
        private: 0x02fac398,
      },
      pubKeyHash: 0x1e,
      scriptHash: 0x16,
      wif: 0x9e
    }
    return getAddress(node, dogecoin)
  }

  /**
   * @param asset - name of the asset e.g. bitcoin
   * @throws error if the asset is not supported
   */
  getAddress(asset, account=0, chain=0, index=0) {
    switch(asset) {
      case 'bitcoin': return this.getBtcAddress(account, chain, index)
      case 'ethereum': return this.getEthAddress(account, chain, index)
      case 'litecoin': return this.getLtcAddress(account, chain, index)
      case 'dogecoin': return this.getDogeAddress(account, chain, index)
      default:
        throw new Error("Asset is not supported")
    }
  }
  
}