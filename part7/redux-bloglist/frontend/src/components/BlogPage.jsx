import Togglable from "./togglable"
import BlogForm from "./BlogForm"
import Notification from "./Notification"
import { Link } from "react-router-dom"
import Menu from "./Menu"
import { Table } from "react-bootstrap"
import LoginForm from "./LoginForm"

const BlogPage = ({  
  user, handleLogout, blogFormRef, addBlog, blogs, login}) => {

  if (user === null)
    return (
      <div className="container">
        <LoginForm login={login} />
      </div>
    );

  return (
    <div className="container">
      <Menu user={user} handleLogout={handleLogout}/>
      <h2>blog app</h2>
      <Notification />
      <Togglable
        buttonLabel="create a new blog"
        ref={blogFormRef}
        aria-label="create a new blog"
      >
      <BlogForm createBlog={addBlog} />
      </Togglable>
      <Table striped>
        <tbody>
        {blogs
        .map(blog => (
          <tr key={blog.id}>
            <td>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title}
              </Link>
            </td>
            <td>
              {blog.user.name}
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  )
}

export default BlogPage