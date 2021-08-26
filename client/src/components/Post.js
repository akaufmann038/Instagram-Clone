import { Card, CardHeader, CardActions, Button, TextField } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles"
import { useEffect, useState } from 'react';
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

    const getImage = () => {
        const imageData = new Buffer.from(postData.imageData).toString("base64")

        const imageType = postData.contentType

        const imageString = "data:" + imageType + ";base64," + imageData

        return imageString
    }


    const styles = useStyles()

    return (
        <>
            <div className="col-xl-8 col-lg-7">
                {/* <img className="img-fluid mb-3 mb-lg-0" src={mastheadPicture} alt="..." /> */}
                <img className="img-fluid mb-3 mb-lg-0" src={getImage()} />
            </div>
            <div className="col-xl-4 col-lg-5">
                <div className="featured-text text-center text-lg-left">
                    {auth.user === postData.authorId ? <h4>By: Me</h4> : <h4>By: {postData.authorFullName}</h4>}
                    <p className="text-black-50 mb-0">
                        {postData.content}
                    </p>
                    <hr class="my-4 mx-auto" />
                    {auth.user === postData.authorId ?
                        <></>
                        :
                        <>
                            <a className="btn btn-success" onClick={() => history.push("/conversations/" + postData.authorId)}>SEND MESSAGE</a>
                            <hr class="my-4 mx-auto" />
                        </>}
                    <Link className="btn btn-success" to={`/feed/${postData._id}`}>VIEW</Link>
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