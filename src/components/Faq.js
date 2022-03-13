import React from 'react'

const Faq = () => {
  return (
    <div className="container">
      <h1 className="text-center">FAQ</h1>
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="mb-3">What is a recovery phrase?</h2>
          <p>
            When you create a new wallet, this app shows you 12 recovery words, also called <b>recovery phrase</b>.<br/>
            The recovery phrase is all you need to restore your wallet.<br/>
            You will be able to restore all your crypto-assets on another device, should your current device break or be lost.<br/>
            It is important to store your recovery phrase somewhere safe, because anyone who has access to the recovery phrase has full control over the funds.
          </p>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="mb-3">What are network fees?</h2>
          <p>
            When you send a crypto-asset to another address, you must pay a fee for the transaction.<br/>
            This transaction fee or network fee is paid to "miners".<br/>
            Miners secure the network of cryptocurrencies.<br/>
            The network fee depends on the cryptocurrency and the current network state.
          </p>
          <b>This wallet does not benefit from any network fees.</b>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="mb-3">Why is my transaction pending?</h2>
          <p>
            Cryptocurrency transactions are not instant. Transactions must be "confirmed" by the network.<br/>
            The time until a transaction is confirmed depends on the cryptocurrency and other factors like the transaction fee and network congestion.<br/>
            A transaction can have the state "pending", "failed", "sent" or "received".<br/>
            If your transaction is "pending", it means that the transaction must still be confirmed by the network.<br/>
            In most cases, you should just wait some time until the transaction has been confirmed.
          </p>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="mb-3">How can I receive cryptocurrencies?</h2>
          <p>
            You can buy cryptocurrencies within this wallet using a credit card.<br/>
            Another option is to directly receive coins by sharing your cryptocurrency address.<br/>
            A cryptocurrency address is a text string which can contain letters and numbers. It is used similar to an IBAN.<br/>
            This is an example for a Bitcoin address: <code>bc1qqlkqw3y3ea797a7rlx99x68r5wmte2eyjg978m</code><br/>
            You can find your cryptocurrency address by clicking on the "Receive" button in the crypto-asset detail page.
          </p>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="mb-3">How can I send cryptocurrencies?</h2>
          <p>
            To send coins to another address, click on the "Send" button in the crypto-asset detail page.<br/>
            Paste the recipient address into the "Address" text field and specify the amount you want to send.<br/>
            Please make sure that you have pasted the correct address into the "Address" field.<br/>
            When you are sure that everything is correct, click on the "Send" button to create the transaction.
          </p>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="mb-3">Can I reverse a transaction?</h2>
          <p>
            No. Cryptocurrency transactions, contrary to credit card transactions cannot be reversed.<br/>
            This is because the blockchain technology does not allow to reverse transactions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Faq
