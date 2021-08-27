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
import Feed from "./components/Feed"
import MyPosts from "./components/MyPosts"
import TestComponent from "./components/TestComponent"


function App() {
  //const [posts, setPosts] = useState([])
  //const [userData, setUserData] = useState([])
  const [appData, setAppData] = useState({
    posts: null,
    userData: null
  })
  const [loading, setLoading] = useState(false)
  const [otherConnected, setOtherConnected] = useState({ connected: false, socketId: "" })

  const [testState, setTestState] = useState(false)

  const changeTestState = () => {
    setTestState(!testState)
  }

  // gets tweets from given data
  const getTweets = (givenData) => {
    let tweets = []

    givenData.forEach(user => {
      let authorFullName = user.firstName + " " + user.lastName
      let authorId = user._id

      tweets = tweets.concat(user.tweets.map(tweet => {
        return {
          content: tweet.content,
          _id: tweet._id,
          authorFullName: authorFullName,
          authorId: authorId,
          createdAt: new Date(tweet.createdAt),
          imageData: tweet.imageData,
          contentType: tweet.contentType
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
    console.log("resetReloading")
    const tweets = getTweets(newData);

    //setUserData(newData)
    //setPosts(tweets)
    setAppData({
      posts: tweets,
      userData: newData
    })
    //setLoading(false)
  }

  useEffect(() => {
    console.log("initial useeffect")
    const fetchData = async () => {
      setLoading(true)

      const result = await fetch("http://localhost:5000/posts")
        .then(response => response.json())
        .then(data => {
          return data
        })

      console.log(result)
      const tweets = getTweets(result);

      //setUserData(result)
      //setPosts(tweets)
      setAppData({
        posts: tweets,
        userData: result
      })
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
            <Route path="/test-route">
              <TestComponent changeTestState={changeTestState} testState={testState}/>
            </Route>
            <PrivateRoute path="/home" useAuth={useAuth}>
              <Home posts={appData.posts} useAuth={useAuth} resetReload={resetReload} loading={loading} />
            </PrivateRoute>
            <PrivateRoute path="/feed" useAuth={useAuth}>
              <Feed posts={appData.posts} useAuth={useAuth} resetReload={resetReload} changeTestState={changeTestState}/>
            </PrivateRoute>
            <PrivateRoute path="/conversations" useAuth={useAuth}>
              <Conversations userData={appData.userData} useAuth={useAuth} resetReload={resetReload} otherConnected={otherConnected} changeOtherConnected={changeOtherConnected} />
            </PrivateRoute>
            <PrivateRoute path="/my-posts" useAuth={useAuth}>
              <MyPosts posts={appData.posts} useAuth={useAuth} />
            </PrivateRoute>
            <PrivateAdminRoute path="/admin" useAuth={useAuth} userData={appData.userData}>
              <Admin userData={appData.userData} resetReload={resetReload} />
            </PrivateAdminRoute>
            {/* <PrivateRoute path="/test-route" useAuth={useAuth}>
              <TestComponent changeTestState={changeTestState} testState={testState}/>
            </PrivateRoute> */}
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

