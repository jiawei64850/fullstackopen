import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      return {
        ...state,
        message: `a new blog ${action.payload.title} by ${action.payload.author} added`,
        type: "success"
      }
    case "WRONGLOGIN":
      return {
        ...state,
        message: "wrong password or username",
        type: "error"
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    "",
  )
  return (
    <NotificationContext.Provider value={[notification, dispatchNotification]}>
        {props.children}
    </NotificationContext.Provider>
  )
}



export default NotificationContext