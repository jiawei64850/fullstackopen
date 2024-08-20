import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend"
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from "./queries";

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const padding = {
    padding: 5
  }


  return (
    <Router>
      <div>
        <Link style={padding} to="/books">books</Link>
        <Link style={padding} to="/authors">authors</Link>
        {token ? 
          (<>
            <Link style={padding} to="/addbook">add book</Link> 
            <Link style={padding} to="/recommendations">recommends</Link>
            <button onClick={logout} >logout</button>
          </> 
        ): (<Link style={padding} to="/login">login</Link>          
        )}
      </div>
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/addbook" element={token ? <NewBook /> : <Navigate replace to="/login" />} /> 
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/recommendations" element={token? <Recommend />: <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
