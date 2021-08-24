
import Post from "./Post"
import { Button, Container } from '@material-ui/core';
import { useHistory, Link } from "react-router-dom"


const Posts = ({ posts, useAuth, resetReload, refetchData }) => {
    let history = useHistory()
    let auth = useAuth()

    return (
        <div class="row gx-0 mb-4 mb-lg-5 align-items-center" style={{ background: "#d4e3fa" }}>
            <button className="btn btn-primary" onClick={() => refetchData()}>REFRESH</button>
            <Link className="btn btn-secondary" to="new-post">NEW POST</Link>
            {posts.map((element, idx) => {
                return <Post key={idx}
                    postData={element}
                    resetReload={resetReload}
                    useAuth={useAuth} />
            })}
        </div>
        // <div>
        //     <Container>
        //         {posts.map((element, idx) => {
        //             return <Post key={idx} 
        //             postData={element}
        //             resetReload={resetReload}
        //             useAuth={useAuth} />
        //         })}
        //     </Container>
        //     <Button color="primary" variant="contained" onClick={() => clickNewPost()}>New Post</Button>
        //     <Button variant="contained" onClick={() => {auth.signout(() => history.push("/login"));}}>Logout</Button>
        // </div>
    )
}

export default Posts