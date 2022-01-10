import React, { useEffect, useState } from 'react'

/**
 * This component takes an array of prices as parameter and displays a <svg> sparkline
 */
const Sparkline = ({prices, width=300, height=100, svgWidth=120, svgHeight=40 }) => {

  const viewBox = `0 0 ${width} ${height}`

  const [linePath, setLinePath] = useState("")
  const [color, setColor] = useState("blue")

  useEffect(() => { 
    // transform the price data to (x|y) coordinates
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const yRange = maxPrice - minPrice

    const xUnit = width / prices.length
    const yUnit = height / yRange

    const dataPoints = prices.map((price, i) => {
      let xValue = i * xUnit
      let yValue = height - ((price - minPrice) * yUnit)
      return {x: xValue, y: yValue}
    })

    let pointsStr = ""
    dataPoints.forEach((point, i, arr) => {
      pointsStr += `${point.x},${point.y}`
      if (i < arr.length-1)
        pointsStr += ","
    })
    setLinePath(pointsStr)

    // set color
    if (prices[prices.length-1] - prices[0] > 0) {
      setColor("green")
    }
    else {
      setColor("red")
    }
  }, [])

  return (
    <svg viewBox={viewBox} className="chart float-end" width={svgWidth} height={svgHeight}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        points={linePath}/>
    </svg>
  )
}

export default Sparkline