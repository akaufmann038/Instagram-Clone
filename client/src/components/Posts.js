
import Post from "./Post"
import { Button, Container } from '@material-ui/core';
import { useHistory } from "react-router-dom"

const Posts = ({ posts, deleteAction, userId }) => {
    let history = useHistory()

    const clickNewPost = () => {
        history.push("/new-post")
    }

    return (
        <div>
            <Container>
                {posts.map((element, idx) => {
                    return <Post key={idx} id={element._id} content={element.content} deleteAction={deleteAction} userId={userId} />
                })}
            </Container>
            <Button color="primary" variant="contained" onClick={() => clickNewPost()}>New Post</Button>
            <Button variant="contained" onClick={() => history.push("/login")}>Login</Button>
        </div>
    )
}

export default Posts