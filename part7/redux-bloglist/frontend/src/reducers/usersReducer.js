import { createSlice } from "@reduxjs/toolkit";
import userServices from "../services/users"

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = userSlice.actions

export const initialUsers = () => {
  return async (dispatch) => {
    const users = await userServices.getAll()
    dispatch(setUsers(users))
  }
}

export default userSlice.reducer