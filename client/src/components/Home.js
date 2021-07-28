import { useState } from "react"
import Posts from "./Posts"
import { Button } from '@material-ui/core';
import { getUsersApi, deleteUserApi, deletePostApi, addUserApi } from "./Utils/Api"

const Home = ({ posts, exampleClientId, useAuth, users, resetReload, loading }) => {
    return (
        <div>
            {loading && <h4>Loading...</h4>}
            <Posts posts={posts} userId={exampleClientId} useAuth={useAuth} resetReload={resetReload}/>
            <Button variant="contained" color="secondary" onClick={() => createUser()} href="http://localhost:3000/">Create User</Button>
            <div>
                Users:
              {users.map(user => {
                return <Button onClick={() => deleteUser(user._id)} href="http://localhost:3000/">Delete {user.firstName}</Button>
            })}
            </div>
        </div>
    )
}

export default Home