import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setMessage(state, action) {
      return action.payload;
    },
    clearMessage() {
      return "";
    },
  },
});

console.log(notificationSlice);

export const { setMessage, clearMessage } = notificationSlice.actions;

export const setNotification = (massage, timeout) => {
  return async (dispatch) => {
    await dispatch(setMessage(massage));
    setTimeout(() => {
      dispatch(clearMessage());
    }, timeout);
  };
};

export default notificationSlice.reducer;
