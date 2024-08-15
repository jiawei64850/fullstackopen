import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";


const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    likeBlog(state, action) {
      const id = action.payload;
      return state.map((blog) =>
        blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog,
      );
    },
    setBlogs(state, action) {
      return action.payload;
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
    addComment(state, action) {
      const {id, comment} = action.payload
      return state.map(blog =>
        blog.id === id ? { ...blog, comments: [...blog.comments, comment]} : blog
      )
    }
  },
});

export const { appendBlog, likeBlog, setBlogs, deleteBlog, addComment } = blogSlice.actions;

export const initialBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (object) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(object);
    dispatch(appendBlog(newBlog));
  };
};

export const updateBlog = (id, object) => {
  return async (dispatch) => {
    const updatedblog = await blogService.update(id, object);
    dispatch(likeBlog(updatedblog.id));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.getRidOf(id);
    dispatch(deleteBlog(id));
  };
};

export const createBlogComment = (id, object) => {
  return async (dispatch) => {
    const newComment = await blogService.addComment(id, object)
    dispatch(addComment({ id, comment: newComment }))
  }
}



export default blogSlice.reducer;
