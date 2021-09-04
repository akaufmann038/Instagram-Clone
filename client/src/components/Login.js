import { useHistory, Link } from "react-router-dom"
import { useState, useContext } from "react"
import UserContext from './Auth/UserContext'

const Login = ({ changeAuthToken }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstLogin, setFirstLogin] = useState(true)

    let history = useHistory()
    const auth = useContext(UserContext)

    //let { from } = location.state || { from: { pathname: "/home" } };
    let { from } = { from: { pathname: "/home" } };

    let login = (currentUser) => {
        auth.signin(() => {
            history.replace(from);
        }, currentUser);
    };

    const onSubmit = (e) => {
        e.preventDefault()

        // try login with server
        // if valid, login
        // hit api with username and password, get back boolean

        // if not valid, prompt user to try again

        fetch("/attempt-login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then((response) => {
                // user was found
                if (response.message === "User found!") {
                    changeAuthToken(response.AuthToken)
                    login(response.user._id)
                }
                else if (response.message === "User not found!") {
                    alert(response.message)
                    setFirstLogin(false)
                }
            })
    }

    return (
        <div className="text-center" 
        style={{ 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            paddingTop: "40px",
            paddingBottom: "40px"
            }}>
            <main style={{ width: "100%", maxWidth: "330px", padding: "15px", margin: "auto" }}>
                <form onSubmit={(e) => onSubmit(e)}>
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                    <div className="form-floating">
                        <input type="username" className="form-control" id="floatingInput" placeholder="Username"
                        onChange={e => setUsername(e.target.value)} required/>
                        <label>Username</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                        onChange={e => setPassword(e.target.value)} required/>
                        <label>Password</label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                </form>
                <h5>Don't have an account? Register {<Link to="register">Here</Link>}</h5>
            </main>
        </div>
    )
}

export default Login

