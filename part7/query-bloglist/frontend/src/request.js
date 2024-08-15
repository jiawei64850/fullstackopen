import axios from "axios";

const baseUrl = "http://localhost:3003/api/blogs";
export const getBlogs = () => axios.get(baseUrl).then((res) => res.data);

export const create = (newBlog) =>
  axios.post(baseUrl, newBlog).then((res) => res.data);

export const update = (updateBlog) => {
  axios
    .put(`${baseUrl}/${updateBlog.id}`, updateBlog)
    .then((res) => res.data)
};

export const remove = (deleteBlog) => {
  axios
    .delete(`${baseUrl}/${deleteBlog.id}`, deleteBlog)
    .then((res) => res.data)
}

