import { useState, useEffect } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const DisplayTheDays = ({ anecdotes, votes, selected, voteClick, nextAnecdote }) => {
  return (
    <div>
      <h1>Anecdotes of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={voteClick} text="vote" />
      <Button handleClick={nextAnecdote} text="next anecdote" />
    </div>
  )
}

const DisplayTheMostVotes = ({ anecdotes, votes, mostVotesIndex }) => {
  if (mostVotesIndex === -1) {
    return (
      <div>
        <h1>Anecdotes with most votes</h1>
        <p>No votes yet</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Anecdotes with most votes</h1>
      <p>{anecdotes[mostVotesIndex]}</p>
      <p>has {votes[mostVotesIndex]} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [mostVotesIndex, setMostVotesIndex] = useState(-1)

  const voteClick = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  useEffect(() => {
    const maxVotes = Math.max(...votes)
    const maxIndex = votes.indexOf(maxVotes)
    if (maxVotes > 0) {
      setMostVotesIndex(maxIndex)
    }
  }, [votes])

  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  return (
    <div>
      <DisplayTheDays
        voteClick={voteClick}
        nextAnecdote={nextAnecdote}
        anecdotes={anecdotes}
        selected={selected}
        votes={votes}
      />
      <DisplayTheMostVotes
        mostVotesIndex={mostVotesIndex}
        anecdotes={anecdotes}
        votes={votes}  
      />
    </div>
  )
}

export default App