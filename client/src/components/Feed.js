import { Switch, useRouteMatch, Route, useHistory, Link } from "react-router-dom"
import Posts from "./Posts"
import PostPage from "./PostPage"
import UserContext from "./Auth/UserContext"
import { useContext } from 'react'

const Feed = ({ posts, resetReload, loading, authToken }) => {
    let history = useHistory()
    let auth = useContext(UserContext)

    let { path, url } = useRouteMatch()

    // refresh data in application
    const refetchData = async () => {
        //setLoading(true)

        const result = await fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // this needs to be the authToken, not the userId
            body: JSON.stringify({ authToken: authToken, userId: auth.user })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "User authenticated") {
                    return data.posts
                } else {
                    console.log("Refetch data failed")
                }
            })

        resetReload(result)
    }

    return (
        <Switch>
            <Route exact path={path}>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                    <div className="container px-4 px-lg-5">
                        <a className="navbar-brand" href="#page-top">Creative Share</a>
                        <button className="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            Menu
                    <i className="fas fa-bars"></i>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/feed">Feed</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/my-posts">My Posts</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/conversations">Conversations</Link></li>
                                <li className="nav-item"><a className="nav-link" style={{ cursor: "pointer" }} onClick={() => {
                                    auth.signout(() => history.push("/"));
                                }}>LOGOUT</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <section className="projects-section bg-light" id="projects">
                    <div className="container px-4 px-lg-5">
                        {loading && <h4>Loading...</h4>}
                        <Posts
                            posts={posts} // all post data
                            resetReload={resetReload}
                            refetchData={refetchData} />
                    </div>
                </section>
            </Route>
            <Route path={`${path}/:postId`}>
                <PostPage posts={posts} resetReload={resetReload} authToken={authToken}/>
            </Route>
        </Switch>
    )
}

export default Feed