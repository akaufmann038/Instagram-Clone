import { useContext, useEffect } from "react"
import { Switch, useRouteMatch, Route, useHistory, Link } from "react-router-dom"
import UserContext from "./Auth/UserContext"

const Home = ({ resetReload, authToken }) => {
    let auth = useContext(UserContext)
    let history = useHistory()

    let { path, url } = useRouteMatch()

    useEffect(() => {
        console.log("home effect firing")
        const fetchData = async () => {

            const result = await fetch("http://localhost:5000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // this needs to be the authToken, not the userId
                body: JSON.stringify({ authToken: authToken, userId: auth.user })
            })
                .then(response => response.json())
                .then(data => {
                    return data
                })

            console.log(result)
            if (result.message === "User authenticated") {
                resetReload(result.posts)
            }
        }

        fetchData()
    }, [])

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
                <header className="masthead">
                    <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                        <div className="d-flex justify-content-center">
                            <div className="text-center">
                                <h1 className="mx-auto my-0 text-uppercase">Share Creativity</h1>
                                <h2 className="text-white-50 mx-auto mt-2 mb-5">
                                    Share photographs with others.
                                    Navigate to Feed to see all the posts and post something creative of your own!
                                </h2>
                                <Link className="btn btn-primary" to="/feed">To Feed</Link>
                            </div>
                        </div>
                    </div>
                </header>
            </Route>
        </Switch >
    )
}

export default Home

