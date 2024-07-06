import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const ButtonBundle = ({ goodClick, neutralClick, badClick }) => {
  return (
    <div>
      <Button handleClick={goodClick} text="good" />
      <Button handleClick={neutralClick} text="neutral" />
      <Button handleClick={badClick} text="bad" />
    </div>
  )
}

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ total, good, neutral, bad }) => {
  if (total.length === 0) {
    return <div>No feedback given</div>
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="total" value={total.length} />
        <StatisticsLine text="average" value={calculateAverage(total, good, bad)} />
        <StatisticsLine text="positive" value={toPercentage(calculatePositive(total, good))} />
      </tbody>
    </table>
  )
}

const calculateAverage = (total, good, bad) => {
  return total.length === 0 ? 0 : (good - bad) / total.length
}

const calculatePositive = (total, good) => {
  return total.length === 0 ? 0 : good / total.length
}

const toPercentage = (num) => (num * 100).toFixed(2) + ' %'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState([])

  const goodClick = () => {
    setGood(good + 1)
    setTotal(total.concat(1))
  }

  const neutralClick = () => {
    setNeutral(neutral + 1)
    setTotal(total.concat(0))
  }

  const badClick = () => {
    setBad(bad + 1)
    setTotal(total.concat(-1))
  }

  return (
    <div>
      <h1>give feedback</h1>
      <ButtonBundle goodClick={goodClick} neutralClick={neutralClick} badClick={badClick} />
      <h1>statistics</h1>
      <Statistics total={total} good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App