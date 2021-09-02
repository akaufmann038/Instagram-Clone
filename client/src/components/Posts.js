import Post from "./Post"
import { useHistory, Link } from "react-router-dom"


const Posts = ({ posts, resetReload, refetchData }) => {

    return (
        <div class="row gx-0 mb-4 mb-lg-5 align-items-center" style={{ background: "#d4e3fa" }}>
            <button className="btn btn-primary" onClick={() => refetchData()}>REFRESH</button>
            <Link className="btn btn-secondary" to="new-post">NEW POST</Link>
            {posts.map((element, idx) => {
                return <Post key={idx}
                    postData={element}
                    resetReload={resetReload} />
            })}
        </div>
    )
}

export default Posts