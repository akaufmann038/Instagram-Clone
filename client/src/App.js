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
import Conversations from "./components/Conversations"


function App() {
  const [posts, setPosts] = useState([])
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(false)
  const [otherConnected, setOtherConnected] = useState({ connected: false, socketId: "" })

  // gets tweets from given data
  const getTweets = (givenData) => {
    let tweets = []

    givenData.forEach(user => {
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

    return tweets
  }

  const changeOtherConnected = (data) => {
    setOtherConnected(data)
  }

  // resets state data
  const resetReload = (newData) => {
      const tweets = getTweets(newData);

      setUserData(newData)
      setPosts(tweets)
      setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const result = await fetch("http://localhost:5000/posts")
        .then(response => response.json())
        .then(data => {
          return data
        })

      console.log(result)
      const tweets = getTweets(result);

      setUserData(result)
      setPosts(tweets)
      setLoading(false)
    }

    fetchData()

  }, [])



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
            <PrivateRoute path="/conversations" useAuth={useAuth}>
              <Conversations userData={userData} useAuth={useAuth} resetReload={resetReload} otherConnected={otherConnected} changeOtherConnected={changeOtherConnected}/>
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

