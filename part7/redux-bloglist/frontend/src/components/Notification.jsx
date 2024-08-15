import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const { message, variant } = notification;

  return (
    <div className="container">
      {(message &&
        <Alert key={variant} variant={variant}>
          {message}
        </Alert>
      )}
    </div>
  )
};

export default Notification;
