import classNames from 'classnames'
import { formatDistanceToNow, compareDesc } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { groupTxsByDistanceFromNow } from '../utils/txHistory'

export const TxList = ({ assetId, symbol }) => {

  const asset = useSelector( (state) => state.portfolio.find(element => element.id === assetId) )
  const timeDistanceFunc = (date) => formatDistanceToNow(date, {addSuffix: true, includeSeconds: true})

  const [groupedTxs, setGroupedTxs] = useState(null)

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
              <div key={i} className="mt-4">
                <div className="text-muted small">{ timeDistanceFunc(new Date(gtxs[0].date)) }</div>
                {
                  gtxs.map((tx, j) => {
                    const amountClasses = classNames({
                      'text-end': true,
                      'text-success': tx.in,
                      'text-danger': !tx.in
                    })
                    const sign = tx.in ? "+" : "-"
                    return <div key={j}>
                      <div className="card mb-2">
                        <div className="card-body">
                          <div className="d-flex flex-row"> 
                            <div className="align-self-center me-2">
                              { tx.in ?
                                  <div><i className="bi bi-box-arrow-in-down"></i></div>
                                :
                                  <div><i className="bi bi-box-arrow-up"></i></div>
                              }
                              
                            </div>
                            { tx.state === "PENDING" && <div><span className="badge bg-secondary">Pending</span></div> }
                            { tx.state === "RECEIVED" && <div><span className="badge bg-success">Received</span></div> }
                            { tx.state === "SENT" && <div><span className="badge bg-danger">Sent</span></div> }
                            <div className="align-self-end ms-auto">
                              <div className={amountClasses}>
                                {`${sign} ${Number(tx.amount)} ${symbol}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            )
          })
        }
        { groupedTxs.length === 0 && <div><h2>No Transaction History</h2></div> }
      </div>
    )
  }
  
  return (<></>)
}

export default TxList