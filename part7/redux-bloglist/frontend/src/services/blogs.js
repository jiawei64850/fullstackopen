import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;


const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};



const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, object) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`${baseUrl}/${id}`, object, config);
  return response.data;
};

const getRidOf = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const addComment = async (id, object) => {
  const config = {
    headers: { Authorization: token },
  };
  
  const response = await axios.post(`${baseUrl}/${id}/comments`, object, config)
  return response.data
} 

export default { getAll, create, update, getRidOf, setToken, addComment };
