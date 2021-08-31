import { useParams, useHistory, Link } from "react-router-dom"
import { useState, useEffect, useContext } from 'react'
import { Card, CardHeader, CardActions, Button, Container, TextField } from '@material-ui/core';
import mastheadPicture from "../assets/img/bg-masthead.jpg"
import demoImage from "../assets/img/demo-image-01.jpg"
import UserContext from "./Auth/UserContext"

const PostPage = ({ posts, resetReload, authToken }) => {
    let { postId } = useParams()
    let auth = useContext(UserContext)
    let history = useHistory()

    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [newContent, setNewContent] = useState()
    const [imageSrc, setImageSrc] = useState(null)

    const currentPost = posts.find(post => {
        return (post._id === postId)
    })

    useEffect(() => {
        console.log("calling")
        const imageData = new Buffer.from(currentPost.imageData).toString("base64")

        const imageType = currentPost.contentType

        const imageString = "data:" + imageType + ";base64," + imageData

        setImageSrc(imageString)
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        const result = await fetch("http://localhost:5000/edit-post", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            // insert new post here
            body: JSON.stringify({
                userId: auth.user,
                authToken: authToken,
                post: {
                    postId: postId,
                    content: newContent
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "User authenticated") {
                    return data.posts
                } else {
                    console.log("User not authenticated")
                }
            })
        setLoading(false)
        setEditMode(false)
        resetReload(result)
    }

    const deleteAction = async () => {
        setLoading(true)
        const result = await fetch("http://localhost:5000/delete-post", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: auth.user,
                authToken: authToken,
                postId: currentPost._id
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "User authenticated") {
                    return data.posts
                } else {
                    console.log(data.message)
                }
            })

        setLoading(false)
        history.push("/feed")
        resetReload(result)
    }

    const editAction = async () => {
        setLoading(true)
        const result = await fetch("http://localhost:5000/edit-post", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            // insert new post here
            body: JSON.stringify({
                userId: auth.user, post: {
                    postId: postId,
                    content: newContent,
                    createdAt: currentPost.createdAt
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                return data
            })

        setLoading(false)
        resetReload(result)
    }

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
                            <li className="nav-item"><a className="nav-link" style={{ cursor: "pointer" }} onClick={() => {
                                auth.signout(() => history.push("/"));
                            }}>LOGOUT</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <section class="projects-section bg-light" id="projects">
                <div class="container px-4 px-lg-5">
                    <h4>By: {currentPost.authorFullName}</h4>

                    <div class="row gx-0 mb-5 mb-lg-0 justify-content-center">
                        <div class="col-lg-6">
                            <img className="img-fluid" src={imageSrc} alt="..." />
                        </div>
                        {editMode ?
                            <>
                                <div class="col-lg-6">
                                    <div class="bg-black text-center h-100 project">
                                        <div class="d-flex h-100">
                                            <div class="project-text w-100 my-auto text-center text-lg-left">
                                                <form name="edit-form" onSubmit={(e) => onSubmit(e)}>
                                                    <textarea
                                                        class="form-control"
                                                        defaultValue={currentPost.content}
                                                        onChange={e => setNewContent(e.target.value)} />
                                                    <button className="btn text-white " type="submit"  >CONFIRM EDIT</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a className="btn" onClick={() => setEditMode(false)}>CANCEL</a>
                            </>
                            :
                            <>
                                <div class="col-lg-6">
                                    <div class="bg-black text-center h-100 project">
                                        <div class="d-flex h-100">
                                            <div class="project-text w-100 my-auto text-center text-lg-left">
                                                <h5 class="text-white">
                                                    {currentPost.content}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {auth.user === currentPost.authorId ?
                                    <>
                                        <a className="btn" onClick={() => setEditMode(true)}>EDIT</a>
                                        <a className="btn btn-danger" onClick={() => deleteAction()}>DELETE</a>
                                    </>
                                    :
                                    <a
                                        className="btn btn-secondary"
                                        onClick={() => history.push("/conversations/" + currentPost.authorId)}>
                                        SEND MESSAGE
                                        </a>}
                            </>
                        }

                    </div>
                </div>
            </section>
        </>


        // <div>
        //     {loading ? <h3>Loading...</h3> : <></>}
        //     {editMode ?
        //         <Container>
        //             <h4>New Content: {newContent}</h4>
        //             <form onSubmit={(e) => onSubmit(e)}>
        //                 <TextField
        //                     id="outlined-multiline"
        //                     label="Content"
        //                     rows={6}
        //                     multiline
        //                     variant="outlined"
        //                     required
        //                     onChange={e => setNewContent(e.target.value)}
        //                     placeholder={currentPost.content} />
        //                 <Button
        //                     type="submit"
        //                     variant="contained"
        //                     color="primary">Confirm Edit</Button>
        //             </form>
        //             <Button
        //                 onClick={() => setEditMode(false)}
        //                 color="primary"
        //                 variant="contained">Cancel</Button>
        //         </Container>
        //         :
        //         <Card>
        //             <CardHeader title={`Content: ${currentPost.content}`} />
        //             <CardHeader title={`ID: ${currentPost._id}`} />
        //             <CardHeader title={`Author: ${currentPost.author}`} />
        //             <CardActions>
        //                 {(auth.user === currentPost.author) && <Button color="secondary" variant="contained"
        //                     onClick={() => deleteAction()}
        //                 >Delete</Button>}
        //                 <Button color="primary" variant="contained"
        //                     onClick={() => setEditMode(true)}>Edit</Button>

        //                 <Button color="primary" variant="contained"
        //                     onClick={() => history.push("/home")}>Back</Button>
        //             </CardActions>
        //         </Card>}

        // </div>
    )
}

export default PostPage