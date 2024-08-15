import Notification from "./Notification";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import { Table } from "react-bootstrap";
import LoginForm from "./LoginForm";


const UserPage = ({ users, user, handleLogout, login }) => {
  if (user === null)
    return (
      <div className="container">
        <LoginForm login={login} />
      </div>
    );

  return (
    <div className="container">
      <Menu user={user} handleLogout={handleLogout}/>
      <h2>blog app</h2>
      <Notification />
      <h2>Users</h2>
      <div>
        <Table striped>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users
              .map(user => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`}>
                      {user.username}
                    </Link>
                  </td>  
                  <td>{user.blogs.length}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default UserPage