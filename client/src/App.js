import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import Posts from "./components/Posts"
import New from "./components/New"
import Login from "./components/Login"
import Home from "./components/Home"
import Admin from "./components/Admin"
import { useState, useEffect, createContext, useContext } from "react"
import { Button } from '@material-ui/core';
import { getUsersApi, deleteUserApi, deletePostApi, addUserApi } from "./components/Utils/Api"
import ProvideAuth from "./components/Auth/ProvideAuth"
import PrivateRoute from "./components/Auth/PrivateRoute"
import PrivateAdminRoute from "./components/Auth/PrivateAdminRoute"


function App() {
  const [posts, setPosts] = useState([])
  const [userData, setUserData] = useState([])
  //const [currentUser, setCurrentUser] = useState()
  const [reload, setReload] = useState(false)
  const [loading, setLoading] = useState(false)

  const resetReload = () => {
    setReload(!reload)
  }

  const handleUsers2 = (data) => {
    console.log(data)


    let tweets = []

    data.forEach(user => {
      let userId = user._id

      tweets = tweets.concat(user.tweets.map(tweet => {
        return {
          content: tweet.content,
          _id: tweet._id,
          author: userId,
          createdAt: new Date(tweet.createdAt)
        }
      }))
    })
    tweets.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    
    setPosts(tweets)
    setUserData(data)
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
        //handleUsers(data)
        handleUsers2(data)
      })
      .then(() => setLoading(false))
      .finally(() => console.log("done fetching data!"))
  }, [reload])



  const authContext = createContext()

  function useAuth() {
    return useContext(authContext);
  }


  return (
    <div>
      <ProvideAuth authContext={authContext}>
        <Router>
          <Switch>
            <PrivateRoute path="/new-post" useAuth={useAuth}>
              <New useAuth={useAuth} resetReload={resetReload} />
            </PrivateRoute>

            <Route path="/login">
              <Login useAuth={useAuth} />
            </Route>
            <PrivateRoute path="/home" useAuth={useAuth}>
              <Home posts={posts} useAuth={useAuth} resetReload={resetReload} loading={loading} />
            </PrivateRoute>
            <PrivateAdminRoute path="/admin" useAuth={useAuth} userData={userData}>
              <Admin userData={userData} resetReload={resetReload} />
            </PrivateAdminRoute>
            <PrivateRoute path="/" useAuth={useAuth}>
              <Redirect to="/home" />
            </PrivateRoute>
          </Switch>
        </Router>
      </ProvideAuth>
    </div>
  );
}


export default App;

