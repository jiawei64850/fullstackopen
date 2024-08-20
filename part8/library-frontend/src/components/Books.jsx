import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from "react"


const Books = () => {
  const [genreMode, setgenreMode] = useState(null)


  const {loading, data, refetch} = useQuery(ALL_BOOKS, { 
    variables: { genre: genreMode },
    fetchPolicy: "network-only"
  })

  if (loading) {
    return <div>books loading...</div>
  }

  
  
  const books = data.allBooks


  const handleGenreFilter = (event) => {

    const genre = event.target.value
    console.log('Selected Genre:', genre)
    if (genre !== 'all genres') {
      refetch({ genre })
      setgenreMode(genre)
    } else {
      refetch({ genre: null })
      setgenreMode(null)
    }
  }
  
  const uniqueGenres = [...new Set(books.flatMap(b => b.genres))]


  return (
    <div>
      <h2>books</h2>

      {genreMode && <div>in genre <strong>{genreMode}</strong></div>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {uniqueGenres.map((genre, index) => (
          <button 
            key={`${genre}-${index}`} 
            value={genre} 
            onClick={handleGenreFilter}>
            {genre}
          </button>
        ))}
        <button value='all genres' onClick={handleGenreFilter}>all genres</button>
      </div>
    </div>
  )
}

export default Books
