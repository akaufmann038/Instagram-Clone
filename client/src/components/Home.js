import { useState } from "react"
import Posts from "./Posts"
import PostPage from "./PostPage"
import { Button } from '@material-ui/core';
import { getUsersApi, deleteUserApi, deletePostApi, addUserApi } from "./Utils/Api"
import { Switch, useRouteMatch, Route, useParams, useHistory } from "react-router-dom"
import ipadPicture from "../assets/img/ipad.png"
import mongoDBPicture from "../assets/img/mongodb.jpg"
import nodeExpressPicture from "../assets/img/nodeExpress.jpg"
import reactJSPicture from "../assets/img/reactJS.png"

const Home = ({ posts, useAuth, resetReload, loading }) => {
    let auth = useAuth()
    let history = useHistory()

    let { path, url } = useRouteMatch()

    

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
                                <li className="nav-item"><a className="nav-link" onClick={() => history.push("/home")}>Home</a></li>
                                <li className="nav-item"><a className="nav-link" onClick={() => history.push("/feed")}>Feed</a></li>
                                <li className="nav-item"><a className="nav-link" href="#signup">My Posts</a></li>
                                <li className="nav-item"><a className="nav-link" href="#signup">Conversations</a></li>
                                <li className="nav-item"><a className="nav-link" href="#signup">LOGOUT</a></li>
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
                                <a className="btn btn-primary" onClick={() => history.push("/feed")}>To Feed</a>
                            </div>
                        </div>
                    </div>
                </header>
                <section className="about-section text-center" id="about">
                    <div className="container px-4 px-lg-5">
                        <div className="row gx-4 gx-lg-5 justify-content-center">
                            <div className="col-lg-8">
                                <h2 className="text-white mb-4">Created with...</h2>

                                <p className="text-white-50 mb-4">
                                    React JS
                                    {/* <img className="mb-4 nodeExpressPicture img-fluid" src={reactJSPicture} /> */}
                                </p>
                                <p className="text-white-50 mb-4">
                                    Node JS + Express
                                    {/* <img className="mb-4 nodeExpressPicture img-fluid" src={nodeExpressPicture} /> */}
                                </p>
                                <p className="text-white-50 mb-4">
                                    MongoDB
                                    {/* <img className="mb-4 mongoDBPicture img-fluid" src={mongoDBPicture} /> */}
                                </p>
                                <p className="text-white-50 mb-4">
                                    Metamask
                                </p>

                            </div>
                        </div>
                        {/* <img className="img-fluid" src={"../assets/img/ipad.png"} alt="..." /> */}
                        {/* <img className="img-fluid" src={ipadPicture} /> */}
                    </div>
                </section>



                {/* <div>
                    {loading && <h4>Loading...</h4>}
                    <Posts
                        posts={posts} // all post data
                        useAuth={useAuth}
                        resetReload={resetReload} />
                    <Button variant="contained" color="primary" onClick={() => history.push("/admin")} >Admin Page</Button>
                    <Button variant="contained" color="primary" onClick={() => history.push("/conversations")} >Conversations Page</Button>
                    <Button variat="contained" color="primary" onClick={() => refetchData()}>Refresh</Button>
                </div> */}
            </Route>
        </Switch>

    )
}

export default Home

