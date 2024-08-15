import Notification from "./Notification";
import LoginForm from "./LoginForm";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateBlog, createBlogComment } from "../reducers/blogReducer";
import Menu from "./Menu";
import { Button } from "react-bootstrap";

const BlogByBlogID = ({ blogs, user, handleLogout, login }) => {
  const dispatch = useDispatch()

  const blogID = useParams().id
  
  const clickedBlog = blogs.find(blog => blog.id === blogID);

  

  if (!clickedBlog) {
    return <div>Loading...</div>; 
  }
  
  const clickedBlogComments = clickedBlog.comments || []
  
  
  const handleUpdate = async (blog) => {
    await dispatch(updateBlog(blog.id, { ...blog, likes: blog.likes + 1 }));
  };

  const handleAddComment = async (event, id) => {
    event.preventDefault()
    const comment = event.target.comment.value
    if (comment.trim() === "") return;
    await dispatch(createBlogComment(id, { comment }))
    console.log(comment);
    
    event.target.comment.value = ''
  }
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
      <div key={clickedBlog.id}>
        <h2>{clickedBlog.title}</h2>
        <span>
          <Link to={clickedBlog.url}>
            {clickedBlog.url}
          </Link>
        </span>
        <br />
        <span>{clickedBlog.likes} likes</span>
        <Button variant="primary" onClick={()=> handleUpdate(clickedBlog)}>like</Button>
        <br />
        <span>added by {clickedBlog.user.name}</span>
      </div>
      
      <div>
        <h3>comments</h3>
        <form onSubmit={(event)=> handleAddComment(event, clickedBlog.id)}>
        <input name="comment" placeholder="add a comment"></input>
        <Button variant="primary" type="submit">add comment</Button>
        </form>
          <ul>
            {[...clickedBlogComments]
              .map((comment) => ( 
              <li key={comment.id}>
                {comment.content}
              </li>
              ))}
          </ul> 
      </div>
    </div>
  )
}

export default BlogByBlogID