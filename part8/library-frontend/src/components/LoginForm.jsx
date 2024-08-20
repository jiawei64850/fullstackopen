import { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { LOGIN, FIND_FAVORITEGENRES } from '../queries'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [ login, loginResult ] = useMutation(LOGIN, {
    onError: (error) => {
      console.error('error', error.message || error)
    }
  })

  const [getFavoriteGenres, genresResult] = useLazyQuery(FIND_FAVORITEGENRES, {
    onError: (error) => {
      console.error('Error fetching favorite genres:', error.message || error);
    }
  })


  useEffect(() => {
    if (loginResult.data) {
      const token = loginResult.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      
      
      getFavoriteGenres({ variables: { username } })
    }
  }, [loginResult.data])

  useEffect(() => {
    if (genresResult.data) {
      const genres = genresResult.data.findFavoriteGenres.favoriteGenre
      localStorage.setItem('library-user-favoriteGenres', JSON.stringify(genres))
      navigate('/books')
    }
  }, [genresResult.data])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm