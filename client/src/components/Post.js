import { Card, CardHeader, CardActions, Button } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles"
import { Switch, useRouteMatch, Route, useParams, useHistory, Link } from "react-router-dom"

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

    const deleteAction = () => {
        fetch("http://localhost:5000/delete-post", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: auth.user, postId: postData._id })
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(response => console.log(response))
            .finally(() => resetReload())
    }



    const styles = useStyles()

    return (
        <Card className={auth.user === postData.author ? styles.userCard : styles.otherCard}>
            <CardHeader title={postData.content} />
            <h4>Author: {postData.author}</h4>
            <CardActions>
                <Button color="secondary" variant="contained" 
                onClick={() => deleteAction()}
                >Delete</Button>
                <Button color="primary" variant="contained"
                onClick={() => history.push("/home/" + postData._id)}>View</Button>
            </CardActions>
            <h4>ID: {postData._id}</h4>
            <h4>Create At: {String(postData.createdAt)}</h4>
        </Card>
    )
}

export default Post