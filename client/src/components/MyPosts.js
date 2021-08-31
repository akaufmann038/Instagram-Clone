import { Link, useHistory } from 'react-router-dom'
import { useContext } from 'react'
import UserContext from "./Auth/UserContext"

const MyPosts = ({ posts }) => {
    let auth = useContext(UserContext)
    let history = useHistory()

    const myPosts = posts.filter(post => {
        return post.authorId === auth.user
    })

    return (
        <>
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
                        {myPosts.length === 0 ?
                            <div class="col-md-4 mb-3 mb-md-0 mt-4">
                                <h3 class="text-white">You have no posts</h3>
                            </div>
                            : <></>}
                        {myPosts.map((element, key) => {
                            return (
                                <div class="col-md-4 mb-3 mb-md-0 mt-4" key={key}>
                                    <div class="card py-4 h-100" style={{ background: "#f0f0f0" }}>
                                        <div class="card-body text-center" >
                                            <h3>{element.content}</h3>
                                            <hr class="my-4 mx-auto" />
                                            <Link className="btn btn-success" to={`/feed/${element._id}`}>VIEW</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyPosts