import { useState } from "react"
import Posts from "./Posts"
import PostPage from "./PostPage"
import { Button } from '@material-ui/core';
import { getUsersApi, deleteUserApi, deletePostApi, addUserApi } from "./Utils/Api"
import { Switch, useRouteMatch, Route, useParams, useHistory } from "react-router-dom"

const Home = ({ posts, useAuth, resetReload, loading }) => {
    let auth = useAuth()
    let history = useHistory()

    const createUser = () => {
        fetch("http://localhost:5000/new-user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "message": "nothing" })
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(response => console.log(response))
    }

    let { path, url } = useRouteMatch()
   

    return (
        <Switch>
            <Route exact path={path}>
                <div>
                    {loading && <h4>Loading...</h4>}
                    <Posts
                        posts={posts} // all post data
                        useAuth={useAuth}
                        resetReload={resetReload} />
                    <Button variant="contained" color="primary" onClick={() => history.push("/admin")} >Admin Page</Button>
                    <Button variant="contained" color="secondary" onClick={() => createUser()} >Create User</Button>
                    <div>
                        Users:
                        <Button >Delete {auth.user}</Button>
                    </div>
                </div>
            </Route>
            <Route path={`${path}/:postId`}>
                <PostPage posts={posts} useAuth={useAuth} resetReload={resetReload}/>
            </Route>
        </Switch>

    )
}

export default Home

