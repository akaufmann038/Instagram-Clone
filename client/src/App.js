import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Posts from "./components/Posts"
import New from "./components/New"
import Login from "./components/Login"
import { useState, useEffect } from "react"
import { Button } from '@material-ui/core';

const exampleClientId = "60fac4ab91628f28e1bcb25d"

function App() {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])

  const addPost = (newPost) => {
    setPosts([...posts, newPost])
  }

  const handleUsers = (data) => {

    if (data.length > 0) {
      const currentUser = data.find((element) => {
        return element._id === exampleClientId
      })

      if (currentUser.tweets.length > 0) {
        setPosts(currentUser.tweets)
      }

      setUsers(data)
    }
  }


  // gets data for logged in user
  const getUsersApi = async () => {
    await fetch("http://localhost:5000/posts", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => handleUsers(res))
  }

  const deleteUserApi = async (id) => {
    await fetch("http://localhost:5000/delete-user", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: id })
    })
  }

  const deletePostApi = async (userId, postId) => {
    await fetch("http://localhost:5000/delete-post", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId, postId: postId })
    })
  }

  const addUserApi = async () => {
    await fetch("http://localhost:5000/new-user", {
      method: "POST"
    })
  }

  useEffect(() => {
    getUsersApi()
  })

  const deleteUser = (userId) => {
    console.log(userId)
    deleteUserApi(userId)
  }

  // create an example user that is myself
  const createUser = () => {
    console.log("creating user")

    addUserApi()
  }

  return (
    <div>

      <Router>
        <Switch>
          <Route path="/new-post">
            <New userId={exampleClientId} addPost={addPost}/>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Posts posts={posts} deleteAction={deletePostApi} userId={exampleClientId} />
            <Button variant="contained" color="secondary" onClick={() => createUser()} href="http://localhost:3000/">Create User</Button>
            <div>
              Users:
              {users.map(user => {
              return <Button onClick={() => deleteUser(user._id)} href="http://localhost:3000/">Delete {user.firstName}</Button>
            })}
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}


export default App;