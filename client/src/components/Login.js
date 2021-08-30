import { Button, TextField } from '@material-ui/core';
import { useHistory, useLocation, Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import UserContext from './Auth/UserContext'

const Login = ({ }) => {
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

        fetch("http://localhost:5000/attempt-login", {
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

                    login(response.user._id)
                }
                else if (response.message === "User not found!") {
                    setFirstLogin(false)
                }
            })
    }

    return (
        <div>
            {firstLogin ? <h3>Login with Username and Password</h3> : <h3>Login Failed! Try again.</h3>}
            <form onSubmit={(e) => onSubmit(e)}>
                <TextField name="username" id="outlined-multiline" label="Username" variant="outlined" required onChange={e => setUsername(e.target.value)}/>
                <TextField name="password" id="outlined-multiline" label="Password" variant="outlined" required onChange={e => setPassword(e.target.value)}/>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary">Login</Button>
            </form>
            <h3>Username: {username}</h3>
            <h3>Password: {password}</h3>
            <h5>Don't have an account? Register {<Link to="register">Here</Link>}</h5>
        </div>
    )
}

export default Login