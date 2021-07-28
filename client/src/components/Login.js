import { Button, TextField } from '@material-ui/core';
import { useHistory, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

const Login = ({ useAuth }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    let history = useHistory()
    let location = useLocation()
    let auth = useAuth()

    let { from } = location.state || { from: { pathname: "/home" } };

    let login = () => {
        auth.signin(() => {
            history.replace(from);
        });
    };

    const onSubmit = (e) => {
        e.preventDefault()
        
        login()
    }

    return (
        <div>
            <form onSubmit={(e) => onSubmit(e)}>
                <TextField id="outlined-multiline" label="Username" variant="outlined" required onChange={e => setUsername(e.target.value)}/>
                <TextField id="outlined-multiline" label="Password" variant="outlined" required onChange={e => setPassword(e.target.value)}/>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary">Login</Button>
            </form>
            <h3>Username: {username}</h3>
            <h3>Password: {password}</h3>
        </div>
    )
}

export default Login