import { useState } from "react"
import { TextField, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom"

const New = ({ useAuth, resetReload }) => {
    let history = useHistory()
    let auth = useAuth()

    const [post, setPost] = useState({
        content: ""
    })
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()

        
        setLoading(true)

        const result = await fetch("http://localhost:5000/new-post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: auth.user, post: post })
        })
        .then(response => response.json())
        .then(data => {
            return data
        })

        
        history.push("/home")
        resetReload(result)
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