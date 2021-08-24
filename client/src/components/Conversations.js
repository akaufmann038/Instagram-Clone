import { Button } from '@material-ui/core'
import { useHistory, Switch, Route, useRouteMatch, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Convo from './Convo'

const Conversations = ({ userData, useAuth, resetReload, otherConnected, changeOtherConnected }) => {
    let history = useHistory()
    const [myMessages, setMyMessages] = useState([])
    const [otherMessages, setOtherMessages] = useState([])
    const [messages, setMessages] = useState([])

    let { path, url } = useRouteMatch()
    let auth = useAuth()

    // get conversations for current user
    const myConversations = userData.find(user => {
        return user._id === auth.user
    }).conversations

    // left off here. was about to finish conversations page
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
                                <li className="nav-item"><a className="nav-link" onClick={() => {
                                    auth.signout(() => history.push("/"));
                                }}>LOGOUT</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <section class="contact-section bg-black">
                    <div class="container px-4 px-lg-5">
                        <div class="row gx-4 gx-lg-5 pb-3">
                            {myConversations.map((element, key) => {
                                return (
                                    <div class="col-md-4 mb-3 mb-md-0 mt-4" key={key}>
                                        <div class="card py-4 h-100" style={{ background: "#f0f0f0" }}>
                                            <div class="card-body text-center" >
                                                <Link class="btn bg-white" to={`/conversations/${element.userId}`}>Enter Conversation</Link>
                                                <hr class="my-4 mx-auto" />
                                                <div class="small text-black-50">4923 Market Street, Orlando FL</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
                {/* <div>
                    <h4>Hello from Conversations Page!</h4>
                    {myConversations.map((element, key) => {
                        return (
                            <section key={key}>
                                Conversation with {element.userId}
                                <Button 
                                variant="contained" 
                                onClick={() => history.push("/conversations/" + element.userId)}>Enter Conversation</Button>
                            </section>
                        )
                    })}
                    <Button variant="contained" color="primary" onClick={() => history.push("/home")}>Home</Button>
                </div> */}
            </Route>
            <Route path={`${path}/:otherUserId`}>
                <Convo useAuth={useAuth} userData={userData} resetReload={resetReload} otherConnected={otherConnected} changeOtherConnected={changeOtherConnected} />
            </Route>
        </Switch>
    )
}

export default Conversations