import { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, BOOK_ADDED } from '../queries'
import { useNavigate } from 'react-router-dom'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [  {query: ALL_BOOKS} ],
    onCompleted: (data) => {
      const addedBook = data.addBook;
      console.log('Book added:', addedBook);
      window.alert(`${addedBook.title} by ${addedBook.author.name} added successfully!`);
      
      navigate('/books')
    },
    onError: (error) => {
      console.error('Error creating book:', error || error.message)
    }
  })


  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.addbook
      console.log(`${addedBook} added`)
      
      
      window.alert(`${addedBook.title} added`)

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ existingData }) => {
        return {
          allBooks: existingData.allBooks.concat(addedBook),
        }
      })
    }
  })

  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    
    console.log('add book...')
    createBook({ variables: { title, author, published: parseInt(published), genres } })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook