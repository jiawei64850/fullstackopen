import Notification from "./Notification";
import { useParams } from "react-router-dom";
import Menu from "./Menu";
import LoginForm from "./LoginForm";
const BlogsByUserID = ({ users, user, handleLogout, login }) => {
  const userID = useParams().id
  
  const clickedUser = users.find(user => user.id === userID);

  if (!clickedUser) {
    return <div>Loading...</div>; // Render a loading state while users are being fetched
  }
  
  const blogOfClickedUser = clickedUser.blogs

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
      <h2>{clickedUser.username}</h2>
      <h3>added blogs</h3>
      <div>
        <ul>
          {blogOfClickedUser
              .map(blog => (
                <li key={blog.id}>{blog.title}</li>
              ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogsByUserID