import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/togglable";
import Notification from "./components/Notification";
import { getAll, create, update, remove, setToken } from "./services/blogs";
import loginService from "./services/login";
import "./index.css";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import NotificationContext from "./NotificationContext";
import UserContext from "./UserContext";

const App = () => {
  
  const queryClient = useQueryClient()
  
  const blogFormRef = useRef();

  const [notification, dispatchNotification] = useContext(NotificationContext)
  const [user, dispatchUser] = useContext(UserContext);


  
  const blogResult = useQuery({
    queryKey: ["blogs"],
    queryFn: getAll,
  })

  console.log(JSON.parse(JSON.stringify(blogResult)));

  
  


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatchUser({ type: "SETUSER", payload: user });
      setToken(user.token);
    }
  }, []);
  
  const createBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"]})
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"]})
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"]})
    }
  })

  if (blogResult.isLoading) {
    return <div>loading data...</div>;
  }

  const blogs = blogResult.data

  const userLogin = async (Credential) => {
    try {
      const user = await loginService.login(Credential);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setToken(user.token);
      dispatchUser({ type: "SETUSER", payload: user });
    } catch (exception) {
      dispatchNotification({ type: "CLEAR" })
      dispatchNotification({ type: "WRONGLOGIN" })
      setTimeout(() => {
        dispatchNotification({ type: "CLEAR" })
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    setToken(null);
    dispatchUser({ type: "REMOVEUSER" });
    window.localStorage.clear();
  };

  const findCreatorName = async (userId) => {
    const blog = blogs.find((blog) => blog.user.id === userId);
    return blog ? blog.user.name : "";
  };

  const addBlog = async (object) => {
    blogFormRef.current.toggleVisibility();
    createBlogMutation.mutate(object)
    dispatchNotification({ type: "CLEAR" })
      dispatchNotification({ type: "CREATE", payload: { title: object.title, author: object.author } })
      setTimeout(() => {
        dispatchNotification({ type: "CLEAR" })
      }, 5000);
  };

  const updateBlog = async (blog) => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1})
  };

  const deleteBlog = async (blog) => {
    if (
      window.confirm(
        `remove blog ${blog.title} by ${blog.author}`,
      )
    ) {
      deleteBlogMutation.mutate(blog);
    }
  };

  console.log('user', user);
  
  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification />
      <LoginForm login={userLogin} />
    </>
  );

  

  const blogForm = () => (
    <>
      <h2>blogs</h2>
      <Notification/>
      <div>
        <p>
          {user.username} loggedin
          <button type="button" onClick={handleLogout} aria-label="logout">
            logout
          </button>
        </p>
        <Togglable
          buttonLabel="create a new blog"
          ref={blogFormRef}
          aria-label="create a new blog"
        >
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleUpdate={() => updateBlog(blog)}
              handleDelete={() => deleteBlog(blog)}
              loginUser={user.name}
              findCreatorName={findCreatorName}
            />
          ))}
      </div>
    </>
  );

  return <div>{user === null ? loginForm() : blogForm()}</div>;
};

export default App;
