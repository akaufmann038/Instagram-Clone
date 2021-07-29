import { Card, CardHeader, CardActions, Button } from '@material-ui/core';

const Post = ({ content, id, resetReload, useAuth }) => {

    let auth = useAuth()

    const deleteAction = (postId) => {
        fetch("http://localhost:5000/delete-post", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: auth.user, postId: postId })
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

    return (
        <Card>
            <CardHeader title={content} />
            <CardActions>
                <Button color="secondary" variant="contained" onClick={() => deleteAction(id)} >Delete</Button>
            </CardActions>
            <h4>ID: {id}</h4>
        </Card>
    )
}

export default Post