import { useState } from "react"
import { TextField, Button } from '@material-ui/core';
import { useHistory, Link } from "react-router-dom"

const New = ({ useAuth, resetReload }) => {
    let history = useHistory()
    let auth = useAuth()

    const [postData, setPostData] = useState({
        content: "",
        userId: auth.user
    })
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        
        // consolidate all data into FormData object
        let allData = new FormData()
        allData.append("content", postData.content)
        allData.append("userId", postData.userId)
        allData.append("image", image.image)

        setLoading(true)

        const result = await fetch("http://localhost:5000/new-post-v2", {
            method: "POST",
            body: allData
        })
            .then(response => response.json())
            .then(data => {
                return data
            })


        history.push("/feed")
        resetReload(result)
    }

    const onOtherSubmit = async (e) => {
        e.preventDefault()

        let toSendData = new FormData()
        toSendData.append("name", "Alex")
        toSendData.append("image", image.image)

        const result = await fetch("http://localhost:5000/test-post", {
            method: "POST",
            body: toSendData
        })
            .then(response => response.json())
            .then(data => {
                return data
            })

        console.log(result)
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
                            <li className="nav-item"><a className="nav-link" onClick={() => {
                                auth.signout(() => history.push("/"));
                            }}>LOGOUT</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <section class="projects-section bg-light" id="projects">
                <div className="container px-4 px-lg-5">
                    <div class="row gx-0 mb-4 mb-lg-5 align-items-center">
                        <form id="new-post" onSubmit={(e) => onSubmit(e)} >
                            <input class="form-control mb-2" type="file" id="formFile" name="image"
                                // change for image input
                                onChange={e => {
                                    // let currImage = new FormData()
                                    // currImage.append("image", e.target.files[0])

                                    setImage({ image: e.target.files[0] })
                                }}
                                required />
                            <textarea class="form-control mb-2"
                                // change for text input
                                onChange={e => {
                                    setPostData({
                                        content: e.target.value,
                                        userId: postData.userId
                                    })
                                }} required />
                        </form>
                        <button form="new-post" type="submit" class="btn btn-secondary">POST</button>
                        <button onClick={() => history.push("/feed")} class="btn btn-danger">CANCEL</button>
                    </div>
                </div>
            </section>
        </>

        // <div>
        //     {loading && <h4>Loading...</h4>}
        //     <form onSubmit={(e) => onSubmit(e)}>
        //         <TextField
        //             name="content"
        //             id="outlined-multiline"
        //             label="Content"
        //             rows={6}
        //             multiline
        //             variant="outlined"
        //             required
        //             onChange={e => setPost({ content: e.target.value })}
        //             value={post.content} />
        //         <Button type="submit" variant="contained" color="primary">Post</Button>
        //         <Button variant="contained" color="secondary" onClick={() => onCancel()} >Cancel</Button>
        //     </form>
        //     <h2>Content: {post.content}</h2>
        // </div>
    )
}

export default New