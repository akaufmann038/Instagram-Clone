import { useParams, useHistory } from "react-router-dom"
import { Card, CardHeader, CardActions, Button } from '@material-ui/core';

const PostPage = ({ posts, useAuth, resetReload }) => {
    let { postId } = useParams()
    let auth = useAuth()
    let history = useHistory()

    const currentPost = posts.find(post => {
        return (post._id === postId)
    })

    const deleteAction = () => {
        fetch("http://localhost:5000/delete-post", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: auth.user, postId: currentPost._id })
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(response => console.log(response))
            .then(() => history.push("/home"))
            .finally(() => resetReload())
    }

    return (
        <div>
            <Card>
                <CardHeader title={`Content: ${currentPost.content}`} />
                <CardHeader title={`ID: ${currentPost._id}`} />
                <CardHeader title={`Author: ${currentPost.author}`} />
                <CardActions>
                    {(auth.user === currentPost.author) && <Button color="secondary" variant="contained"
                        onClick={() => deleteAction()}
                    >Delete</Button>}
                    
                    <Button color="primary" variant="contained"
                    onClick={() => history.push("/home")}>Back</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default PostPage