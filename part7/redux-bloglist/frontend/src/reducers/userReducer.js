import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const loadUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (user && user.token) {
        dispatch(setUser(user));
        blogService.setToken(user.token);
      } else {
        dispatch(clearUser());
      }
    } else {
      dispatch(clearUser());
    }
  };
};

export const saveUser = (Credential) => {
  return async (dispatch) => {
    try {
      window.localStorage.clear();
      const user = await loginService.login(Credential);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      dispatch(setNotification(`welcome back, ${user.name}!`, "success", 5000)); // Success notification
    } catch (exception) {
      dispatch(setNotification("Wrong username or password", "danger", 5000)); // Error notification
    }
  };
};

export const removeUser = () => {
  return async (dispatch) => {
    blogService.setToken(null);
    dispatch(setUser(null));
    window.localStorage.clear();
  };
};

export default userSlice.reducer;
