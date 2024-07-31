import { useState, useEffect } from 'react'

const Blog = ({ blog, updateLikes, deleteSelectedBlog, findCreatorName, loginUser }) => {

  const [visable, setVisable] = useState(false)
  const [creatorName, setCreatorName] = useState('')

  

  useEffect(() => {
    const fetchCreatorName = async () => {
      if (blog.user) {
        const name = await findCreatorName(blog.user)
        setCreatorName(name)
      }
    }

    fetchCreatorName()
  }, [blog.user, findCreatorName])

  const hideWhenVisable = { display: visable ? 'none': '' }
  const showWhenVisable = { display: visable ? '' : 'none' }

  const toggleVisability = () => {
    setVisable(!visable)
  }
  

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    updateLikes({
      ...blog,
      likes: blog.likes + 1
    })
    console.log(blog)
  }
  const handleDelete = async (event) => {
    event.preventDefault()
    deleteSelectedBlog(blog.id)
  }
  
  const isCreator = loginUser === blog.user.name || loginUser === creatorName;

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisable} className='blog-review'>
        {blog.title} {blog.author}
        <button onClick={toggleVisability} aria-label='view'>view</button>
      </div>
      <div style={showWhenVisable} className='blog-detail'>
        <span>
          {blog.title} {blog.author}
          <button onClick={toggleVisability}>hide</button> 
        </span>
        <br />
        <span data-testid='url'>{blog.url}</span> 
        <br />
        <span data-testid='likes'> 
          likes {blog.likes} 
          </span>
        <button onClick={handleUpdate} data-testid='likes-button' aria-label='like'>like</button> 
        <br />
        <span>{blog.user.name? blog.user.name : creatorName}</span>
        {isCreator && (
          <button onClick={handleDelete} aria-label="remove">remove</button>
        )}
      </div>
    </div>
  )}

export default Blog