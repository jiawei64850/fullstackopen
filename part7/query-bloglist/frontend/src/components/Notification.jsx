import NotificationContext from "../NotificationContext";
import { useContext } from "react";

const Notification = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext)
  const { message, type } = notification;

  if (!message) return null;

  const style = {
    backgroundColor: "lightgrey",
    margin: "10px",
    padding: "10px",
    border: "2px solid",
    borderColor: type === "success" ? "green" : "red",
    borderRadius: "5px",
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
