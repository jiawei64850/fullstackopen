import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filteredAnecdote =
      filter === ""
        ? anecdotes
        : anecdotes.filter((a) =>
            a.content.toLowerCase().includes(filter.toLowerCase()),
          );

    return filteredAnecdote;
  });
  console.log(anecdotes);

  const dispatch = useDispatch();

  const vote = (id) => {
    console.log("vote", id);
    dispatch(voteAnecdote(id));
    const matchAnecdote = anecdotes.find((a) => a.id === id);
    dispatch(setNotification(`you voted ${matchAnecdote.content}`, 500));
  };

  return (
    <>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </>
  );
};

export default AnecdoteList;
