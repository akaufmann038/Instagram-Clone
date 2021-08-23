import { Card, CardHeader, CardActions, Button, TextField } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles"
import { Switch, useRouteMatch, Route, useParams, useHistory, Link } from "react-router-dom"
import mastheadPicture from "../assets/img/bg-masthead.jpg"

const useStyles = makeStyles({
    userCard: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        margin: "15px"
    },
    otherCard: {
        background: 'linear-gradient(45deg, rgba(151,213,255,1) 0%, rgba(255,156,0,0.6222864145658263) 100%)',
        margin: "15px"
    }
})

const Post = ({ resetReload, useAuth, postData }) => {

    let auth = useAuth()
    let history = useHistory()
    let { path, url } = useRouteMatch()

    const deleteAction = async () => {
        const result = await fetch("http://localhost:5000/delete-post", {
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



    const styles = useStyles()

    return (
        <>
            <div className="col-xl-8 col-lg-7">
                <img className="img-fluid mb-3 mb-lg-0" src={mastheadPicture} alt="..." />
            </div>
            <div className="col-xl-4 col-lg-5">
                <div className="featured-text text-center text-lg-left">
                    <h4>By: {postData.authorFullName}</h4>
                    <p className="text-black-50 mb-0">
                        {postData.content}
                    </p>
                    <hr class="my-4 mx-auto" />
                    <a className="btn btn-success" onClick={() => history.push("/conversations/" + postData.authorId)}>SEND MESSAGE</a>
                    <hr class="my-4 mx-auto" />
                    <a className="btn btn-success" onClick={() => history.push("/feed/" + postData._id)}>VIEW</a>
                </div>
            </div>
        </>
        // <Card className={auth.user === postData.author ? styles.userCard : styles.otherCard}>
        //     <CardHeader title={postData.content} />
        //     <h4>Author: {postData.author}</h4>
        //     <CardActions>
        //         <Button color="secondary" variant="contained"
        //             onClick={() => deleteAction()}
        //         >Delete</Button>
        //         <Button color="primary" variant="contained"
        //             onClick={() => history.push("/home/" + postData._id)}>View</Button>
        //         {auth.user !== postData.author ?
        //             <Button color="primary" variant="contained"
        //                 onClick={() => history.push("/conversations/" + postData.author)}>Send Message</Button> : <></>}

        //     </CardActions>
        //     <h4>ID: {postData._id}</h4>
        //     <h4>Create At: {String(postData.createdAt)}</h4>
        // </Card>
    )
}

export default Post