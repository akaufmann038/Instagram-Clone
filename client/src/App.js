import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Posts from "./components/Posts"
import New from "./components/New"
import Login from "./components/Login"
import Home from "./components/Home"
import { useState, useEffect, createContext, useContext } from "react"
import { Button } from '@material-ui/core';
import { getUsersApi, deleteUserApi, deletePostApi, addUserApi } from "./components/Utils/Api"
import ProvideAuth from "./components/Auth/ProvideAuth"
import PrivateRoute from "./components/Auth/PrivateRoute"

const exampleClientId = "60fac4ab91628f28e1bcb25d"

function App() {
  const [posts, setPosts] = useState([])
  const [reload, setReload] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const resetReload = () => {
    setReload(!reload)
  }

  const handleUsers = (data) => {

    if (data.length > 0) {
      const currentUser = data.find((element) => {
        return element._id === exampleClientId
      })

      if (currentUser.tweets.length > 0) {
        setPosts(currentUser.tweets)
      }
      else if (currentUser.tweets.length === 0) {
        setPosts([])
      }

      setUsers(data)
    }
  }




  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:5000/posts")
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw response
    })
    .then(data => {
      handleUsers(data)
    })
    .then(() => setLoading(false))
    .finally(() => console.log("done fetching data!"))
  }, [reload])


  // create an example user that is myself
  const createUser = () => {
    console.log("creating user")

    addUserApi()
  }

  return (
    <div>
      <ProvideAuth authContext={authContext}>
        <Router>
          <Switch>
            <PrivateRoute path="/new-post" useAuth={useAuth}>
              <New userId={exampleClientId} resetReload={resetReload}/>
            </PrivateRoute>

            <Route path="/login">
              <Login useAuth={useAuth}/>
            </Route>
            <PrivateRoute path="/home" useAuth={useAuth}>
              <Home posts={posts} exampleClientId={exampleClientId} useAuth={useAuth} users={users} resetReload={resetReload} loading={loading}/>
            </PrivateRoute>
          </Switch>
        </Router>
      </ProvideAuth>
    </div>
  );
}


export default App;

const authContext = createContext()

function useAuth() {
  return useContext(authContext);
}