import { useContext } from 'react';
import { useHistory, Link } from "react-router-dom"
import UserContext from "./Auth/UserContext"

const Post = ({ resetReload, postData }) => {

    let auth = useContext(UserContext)
    let history = useHistory()

    const deleteAction = async () => {
        const result = await fetch("/delete-post", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: auth.user, postId: postData._id })
        })
            .then(response => response.json())
            .then(data => {
                return data
            })

        resetReload(result)
    }

    const getImage = () => {
        const imageData = new Buffer.from(postData.imageData).toString("base64")

        const imageType = postData.contentType

        const imageString = "data:" + imageType + ";base64," + imageData

        return imageString
    }


    return (
        <>
            <div className="col-xl-8 col-lg-7">
                <img className="img-fluid mb-3 mb-lg-0" src={getImage()} />
            </div>
            <div className="col-xl-4 col-lg-5">
                <div className="featured-text text-center text-lg-left">
                    {auth.user === postData.authorId ? <h4>By: Me</h4> : <h4>By: {postData.authorFullName}</h4>}
                    <p className="text-black-50 mb-0">
                        {postData.content}
                    </p>
                    <hr className="my-4 mx-auto" />
                    {auth.user === postData.authorId ?
                        <></>
                        :
                        <>
                            <a className="btn btn-success" onClick={() => history.push("/conversations/" + postData.authorId)}>SEND MESSAGE</a>
                            <hr className="my-4 mx-auto" />
                        </>}
                    <Link className="btn btn-success" to={`/feed/${postData._id}`}>VIEW</Link>
                </div>
            </div>
        </>
    )
}

export default Post