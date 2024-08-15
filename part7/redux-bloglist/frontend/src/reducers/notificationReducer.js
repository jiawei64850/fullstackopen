import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: "", variant: "" },
  reducers: {
    setMessage(state, action) {
      return {
        message: action.payload.message,
        variant: action.payload.variant,
      };
    },
    clearMessage() {
      return { message: "", variant: "" };
    },
  },
});

export const { setMessage, clearMessage } = notificationSlice.actions;

export const setNotification = (message, variant, timeout) => {
  return async (dispatch) => {
    await dispatch(setMessage({ message, variant }));
    setTimeout(() => {
      dispatch(clearMessage());
    }, timeout);
  };
};

export default notificationSlice.reducer;
