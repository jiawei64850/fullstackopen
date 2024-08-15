import { useEffect, useRef } from "react";
import { BrowserRouter as Router,
  Routes, Route, Navigate } from "react-router-dom";
import BlogPage from "./components/BlogPage";
import UserPage from "./components/UserPage";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import BlogsByUserID from "./components/BlogsByUserID";
import BlogByBlogID from "./components/BlogByBlogID";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import { initialBlogs, createBlog } from "./reducers/blogReducer";
import { loadUser, removeUser, saveUser } from "./reducers/userReducer";
import { initialUsers } from "./reducers/usersReducer";



const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initialBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initialUsers());
  }, [dispatch])

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
 
  const userLogin = async (Credential) => {
    await dispatch(saveUser(Credential));
  };


  const handleLogout = async (event) => {
    event.preventDefault();
    dispatch(removeUser());
  };

  const addBlog = async (object) => {
    blogFormRef.current.toggleVisibility();
    await dispatch(createBlog(object));
    await dispatch(initialUsers())
    dispatch(
      setNotification(
        `a new blog ${object.title} by ${object.author} added`,
        "danger",
        5000,
      ),
    );
  };

  const blogFormRef = useRef();
 
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserPage 
          users={users} 
          user={user} 
          login={userLogin} 
          handleLogout={handleLogout} 
          />} 
        />
        <Route path="/blogs" element={<BlogPage 
          user={user}
          login={userLogin}
          handleLogout={handleLogout}
          blogFormRef={blogFormRef}
          addBlog={addBlog}
          blogs={blogs}
          loginUser={user ? user.name : ""}
          />} 
        />
        <Route path="/" element={<BlogPage 
          user={user}
          login={userLogin}
          handleLogout={handleLogout}
          blogFormRef={blogFormRef}
          addBlog={addBlog}
          blogs={blogs}
          loginUser={user ? user.name : ""}
          />} 
        />
        <Route path="/users/:id" element={<BlogsByUserID
          users={users} 
          user={user} 
          login={userLogin} 
          handleLogout={handleLogout} 
          />} 
        />
        <Route path="/blogs/:id" element={<BlogByBlogID
          blogs={blogs}
          user={user}
          login={userLogin} 
          handleLogout={handleLogout} 
          />}
        />
      </Routes>
    </Router>
  );
};

export default App;
