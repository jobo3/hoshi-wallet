import classNames from 'classnames'
import { formatDistanceToNow, compareDesc, format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { groupTxsByDistanceFromNow } from '../utils/txHistory'
import InfoModal from './InfoModal'

export const TxList = ({ assetId, symbol, price }) => {

  const asset = useSelector( state => state.portfolio.find(element => element.id === assetId) )
  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const uiMode = useSelector(state => state.settings.ui)
  const timeDistanceFunc = (date) => formatDistanceToNow(date, {addSuffix: true, includeSeconds: true})

  const [groupedTxs, setGroupedTxs] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)

  const handleTxClick = (tx) => {
    // cypherpunk
    if (uiMode === 2) {
      setSelectedTx(tx)
      setShowModal(true)
    }
  }

  useEffect(() => {
    const txs = [...asset.txs]
    if (txs != null) {
      // sort transactions by date
      txs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
      // group transactions by time from now
      setGroupedTxs(groupTxsByDistanceFromNow(txs, timeDistanceFunc))
    }
  }, [asset, asset.txs])
  
  if (groupedTxs != null) {
    return (
      <div className="mx-auto">
        {
          groupedTxs.map((gtxs, i) => {
            if (gtxs[0] == null) return <div key={i}></div>
            return (
              <div key={i} className="mt-3">
                <div className="text-muted small">{ timeDistanceFunc(new Date(gtxs[0].date)) }</div>
                {
                  gtxs.map((tx, j) => {
                    const amountClasses = classNames({
                      'text-end': true,
                      'text-success': tx.incoming,
                      'text-danger': !tx.incoming
                    })
                    const sign = tx.incoming ? "+" : "-"
                    return (
                      <div key={j}>
                        <div className="card mb-2" onClick={() => handleTxClick(tx)}>
                          <div className="card-body p-2">
                            <div className="d-flex flex-row"> 
                              <div className="align-self-center me-2">
                                { tx.incoming ? <div><i className="bi bi-box-arrow-in-down"></i></div> : <div><i className="bi bi-box-arrow-up"></i></div> }
                              </div>
                              <div className="align-self-center">
                                { tx.state === "PENDING" && <span className="badge bg-secondary">Pending</span> }
                                { tx.state === "RECEIVED" && <span className="badge bg-success">Received</span> }
                                { tx.state === "SENT" && <span className="badge bg-danger">Sent</span> }
                              </div>
                              <div className="ms-auto">
                                <div className="d-flex flex-column">
                                  <div className={amountClasses}>
                                    {`${sign} ${Number(tx.amount)} ${symbol}`}
                                  </div>
                                  <span className="text-muted small text-end">~{(tx.amount * price).toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 2})}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
        { groupedTxs.length === 0 && <div><h2>No Transaction History</h2></div> }
        <InfoModal title="Transaction Details" show={showModal} onClose={() => setShowModal(false)}>
          <div className="text-break">Amount: {selectedTx?.amount?.toString()} {symbol.toUpperCase()}</div>
          <div className="text-break">Transaction fee: {selectedTx?.fee} {symbol.toUpperCase()}</div>
          <div className="text-break">Tx id: {selectedTx?.tx_id}</div>
          <div className="text-break">Date: {selectedTx?.date ? format(new Date(selectedTx.date), 'Ppp') : ''}</div>
          <div className="text-break">Confirmations: {selectedTx?.date ? Math.floor((new Date().getTime() - new Date(selectedTx.date).getTime()) / (1000 * 60 * 10)) : ''}</div>
        </InfoModal>
      </div>
    )
  }
  
  return (<></>)
}

export default TxList
