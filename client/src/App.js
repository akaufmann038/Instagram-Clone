import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import New from "./components/New"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import { useState, useContext } from "react"
import Conversations from "./components/Conversations"
import Feed from "./components/Feed"
import MyPosts from "./components/MyPosts"
import UserContext from "./components/Auth/UserContext"

function App() {
  const [appData, setAppData] = useState({
    posts: null,
    userData: null
  })
  const [loading, setLoading] = useState(false)
  const [otherConnected, setOtherConnected] = useState({ connected: false, socketId: "" })
  const [authToken, setAuthToken] = useState("")

  const changeAuthToken = (newToken) => {
    setAuthToken(newToken)
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
    const tweets = getTweets(newData);

    //setUserData(newData)
    //setPosts(tweets)
    setAppData({
      posts: tweets,
      userData: newData
    })
    //setLoading(false)
  }

  // useEffect(() => {
  //   console.log("initial useeffect")
  //   const fetchData = async () => {
  //     setLoading(true)

  //     const result = await fetch("http://localhost:5000/posts")
  //       .then(response => response.json())
  //       .then(data => {
  //         return data
  //       })

  //     console.log(result)
  //     const tweets = getTweets(result);

  //     //setUserData(result)
  //     //setPosts(tweets)
  //     setAppData({
  //       posts: tweets,
  //       userData: result
  //     })
  //     setLoading(false)
  //   }

  //   fetchData()

  // }, [])

  return (
    <div>

      <UserContext.Provider value={useProvideAuth()}>
        <Router>
          <Switch>
            <PrivateRoute path="/new-post">
              <New resetReload={resetReload} authToken={authToken}/>
            </PrivateRoute>

            <Route path="/login">
              <Login changeAuthToken={changeAuthToken}/>
            </Route>
            <Route path="/register">
              <Register resetReload={resetReload} />
            </Route>
            <PrivateRoute path="/home">
              <Home authToken={authToken} posts={appData.posts} resetReload={resetReload} loading={loading} />
            </PrivateRoute>
            <PrivateRoute path="/feed">
              <Feed posts={appData.posts} resetReload={resetReload} authToken={authToken}/>
            </PrivateRoute>
            <PrivateRoute path="/conversations">
              <Conversations authToken={authToken} userData={appData.userData} resetReload={resetReload} otherConnected={otherConnected} changeOtherConnected={changeOtherConnected} />
            </PrivateRoute>
            <PrivateRoute path="/my-posts">
              <MyPosts posts={appData.posts}/>
            </PrivateRoute>
            <PrivateRoute path="/">
              <Redirect to="/home" />
            </PrivateRoute>
          </Switch>
        </Router>
      </UserContext.Provider >
    </div>
  );
}


export default App;


const useProvideAuth = () => {
  const [user, setUser] = useState(null)

  const signin = (cb, user) => {
    setUser(user)
    cb()
  }

  const signout = (cb) => {
    setUser(null)
    cb()
  }

  return {
    user,
    signin,
    signout
  }
}

const PrivateRoute = ({ path, children }) => {
  const auth = useContext(UserContext)

  return (
    <Route path={path} render={({ location }) => {
      return (
        auth.user ? (children) : (<Redirect to={{ pathname: "/login", state: { from: location } }} />)
      )
    }} />
  )
}