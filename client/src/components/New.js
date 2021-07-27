import { useState } from "react"
import { TextField, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom"

const New = ({ userId, addPost }) => {
    let history = useHistory()

    const [post, setPost] = useState({
        content: ""
    })

    const addPostApi = async (user, newPost) => {
        await fetch("http://localhost:5000/new-post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user, post: newPost })
        })
    }

    const onSubmit = async (e) => {
        history.push("/")

        //setPost({ content: "" })
        //e.preventDefault()

        //window.location = "localhost:3000/"
        
        // add post to database
        await addPostApi(userId, post)
        
        //addPost(post)

        //await refreshData()
    }

    const onCancel = () => {
        history.push("/")
    }



    return (
        <div>
            <form >
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
                <Button type="submit" variant="contained" color="primary" onClick={() => onSubmit()}>Post</Button>
                <Button variant="contained" color="secondary" onClick={() => onCancel()} >Cancel</Button>
            </form>
            <h2>Content: {post.content}</h2>
        </div>
    )
}

export default New