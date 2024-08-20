import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useEffect, useState } from "react"

const Books = () => {
  const [filteredBooks, setFilteredBooks] = useState([])

  const booksResult = useQuery(ALL_BOOKS)
  
  


  useEffect(() => {
    if (booksResult.loading) return

    const books = booksResult.data.allBooks
    const genres = JSON.parse(localStorage.getItem('library-user-favoriteGenres') || '[]')
    if (genres.length > 0) {
      const filtered = books.filter(b => 
        b.genres.some(genre => genres.includes(genre))
      )
      setFilteredBooks(filtered)
      }
    }, [booksResult.loading])

  if (booksResult.loading) {
    return <div>books loading...</div>
  }

  

  const bookToshow = filteredBooks || []
  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genres <strong>patterns</strong></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookToshow.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
