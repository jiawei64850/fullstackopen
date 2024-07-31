import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const userLogin = async (Credential) => {
    try {
      const user = await loginService.login(Credential)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    }
    catch (exception) {
      setMessage('wrong username or password')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    blogService.setToken(null)
    setUser(null)
    window.localStorage.clear()
  }

  const findCreatorName = async (userId) => {
    const blogs = await blogService.getAll()
    const blog = blogs.find(blog => blog.user.id === userId)
    return blog ? blog.user.name : ''
  }

  const addBlog = async (object) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(object)
    setBlogs(blogs.concat(returnedBlog))
    setMessage(`a new blog ${object.title} by ${object.author} added`)
    setMessageType('success')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateBlog = async (object) => {
    const returnedBlog = await blogService.update(object.id, object)
    setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog: blog))
    console.log(returnedBlog);
  }

  const deleteBlog = async (id) => {
    const blogToDetele = blogs.find(blog => blog.id === id)
    if (window.confirm(`remove blog ${blogToDetele.title} by ${blogToDetele.author}`)) {
      const returnedBlog = await blogService.getRidOf(id)
      setBlogs(blogs.filter(blog => blog.id === id ? returnedBlog: blog))
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification message={message} type={messageType} />
      <LoginForm login={userLogin}/>
    </>
  )

  const blogFormRef = useRef()

  const blogForm = () => (
    <>
      <h2>blogs</h2>
      <Notification message={message} type={messageType} />
      <div>
        <p>
          { user.username } loggedin
          <button type="button" onClick={handleLogout} aria-label="logout">logout</button>
        </p>
        <Togglable buttonLabel="create a new blog" ref={blogFormRef} aria-label="create a new blog">
          <BlogForm createBlog={addBlog}/>
        </Togglable>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateLikes={updateBlog}
              deleteSelectedBlog={deleteBlog}
              loginUser={user.name}
              findCreatorName={findCreatorName}/>
          )}
      </div>
    </>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        blogForm()
      }
    </div>
  )
}

export default App