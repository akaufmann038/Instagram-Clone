import { useParams, useHistory } from "react-router-dom"
import { useState } from 'react'
import { Card, CardHeader, CardActions, Button, Container, TextField } from '@material-ui/core';

const PostPage = ({ posts, useAuth, resetReload }) => {
    let { postId } = useParams()
    let auth = useAuth()
    let history = useHistory()

    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [newContent, setNewContent] = useState()

    const currentPost = posts.find(post => {
        return (post._id === postId)
    })

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
                userId: auth.user, post: {
                    postId: postId,
                    content: newContent
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                return data
            })
        console.log(result)
        setLoading(false)
        resetReload(result)
    }

    const deleteAction = async () => {
        setLoading(true)
        const result = await fetch("http://localhost:5000/delete-post", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: auth.user, postId: currentPost._id })
        })
            .then(response => response.json())
            .then(data => {
                return data
            })

        setLoading(false)
        history.push("/home")
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
        <div>
            {loading ? <h3>Loading...</h3> : <></>}
            {editMode ?
                <Container>
                    <h4>New Content: {newContent}</h4>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <TextField
                            id="outlined-multiline"
                            label="Content"
                            rows={6}
                            multiline
                            variant="outlined"
                            required
                            onChange={e => setNewContent(e.target.value)}
                            placeholder={currentPost.content} />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary">Confirm Edit</Button>
                    </form>
                    <Button
                        onClick={() => setEditMode(false)}
                        color="primary"
                        variant="contained">Cancel</Button>
                </Container>
                :
                <Card>
                    <CardHeader title={`Content: ${currentPost.content}`} />
                    <CardHeader title={`ID: ${currentPost._id}`} />
                    <CardHeader title={`Author: ${currentPost.author}`} />
                    <CardActions>
                        {(auth.user === currentPost.author) && <Button color="secondary" variant="contained"
                            onClick={() => deleteAction()}
                        >Delete</Button>}
                        <Button color="primary" variant="contained"
                            onClick={() => setEditMode(true)}>Edit</Button>

                        <Button color="primary" variant="contained"
                            onClick={() => history.push("/home")}>Back</Button>
                    </CardActions>
                </Card>}

        </div>
    )
}

export default PostPage