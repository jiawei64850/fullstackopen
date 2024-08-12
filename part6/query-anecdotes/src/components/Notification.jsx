import NotificationContext from "../notificationContext";
import { useContext } from "react";

const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  const [notification, dispatchNotification] = useContext(NotificationContext);

  return <div style={style}>{notification}</div>;
};

export default Notification;
