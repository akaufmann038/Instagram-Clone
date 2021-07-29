import { useState } from "react"
import Posts from "./Posts"
import { Button } from '@material-ui/core';
import { getUsersApi, deleteUserApi, deletePostApi, addUserApi } from "./Utils/Api"

const Home = ({ posts, exampleClientId, useAuth, resetReload, loading }) => {
    let auth = useAuth()

    const createUser = () => {
        fetch("http://localhost:5000/new-user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"message": "nothing"})
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response
        })
        .then(response => console.log(response))
    }

    return (
        <div>
            {loading && <h4>Loading...</h4>}
            <Posts posts={posts} useAuth={useAuth} resetReload={resetReload}/>
            <Button variant="contained" color="secondary" onClick={() => createUser()} >Create User</Button>
            <div>
                Users:
              
            <Button >Delete {auth.user}</Button>
            </div>
        </div>
    )
}

export default Home