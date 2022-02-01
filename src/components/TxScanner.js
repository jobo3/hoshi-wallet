import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateTxs } from '../features/portfolio/portfolioSlice'

const TxScanner = () => {

  const dispatch = useDispatch()

  useEffect(() => {

    const scanTxs = () => {
      dispatch(updateTxs(null))
    }

    scanTxs()
    // scan every 30 seconds
    const interval = setInterval(scanTxs, 30*1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (<></>)
}

export default TxScanner
