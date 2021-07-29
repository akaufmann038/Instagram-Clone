import { useState } from "react"
import { TextField, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom"

const New = ({ userId, resetReload }) => {
    let history = useHistory()

    const [post, setPost] = useState({
        content: ""
    })
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // add post to database
        fetch("http://localhost:5000/new-post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId, post: post })
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then((reponse) => console.log(reponse))
            .then(() => history.push("/home"))
            .finally(() => resetReload())
    }

    const onCancel = () => {
        history.push("/home")
    }



    return (
        <div>
            {loading && <h4>Loading...</h4>}
            <form onSubmit={(e) => onSubmit(e)}>
                <TextField
                    name="content"
                    id="outlined-multiline"
                    label="Content"
                    rows={6}
                    multiline
                    variant="outlined"
                    required
                    onChange={e => setPost({ content: e.target.value })}
                    value={post.content} />
                <Button type="submit" variant="contained" color="primary">Post</Button>
                <Button variant="contained" color="secondary" onClick={() => onCancel()} >Cancel</Button>
            </form>
            <h2>Content: {post.content}</h2>
        </div>
    )
}

export default New