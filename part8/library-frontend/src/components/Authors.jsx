import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const Authors = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeBorn ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const authorsResult = useQuery(ALL_AUTHORS)

  if (authorsResult.loading) {
    return <div>authors loading...</div>
  }

  const authors = authorsResult.data.allAuthors

  const updateBorn = (event) => {
    event.preventDefault();
    changeBorn({ variables: {name, born: parseInt(born) } })

    setName('')
    setBorn('')
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>add birthyear</h3>
      <form onSubmit={updateBorn}>
        <div>
          <label> name </label>
          <select value={name} onChange={({ target }) => setName(target.value) }>
            {authors.map((a) => (
              <option value={a.name} key={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born <input value={born} onChange={({ target }) => setBorn(target.value) }/>
        </div> 
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
