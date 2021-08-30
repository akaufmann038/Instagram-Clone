import { TextField } from "@material-ui/core"
import { useState } from "react"
import { Link, useHistory } from 'react-router-dom'

const Register = ({ }) => {
    let history = useHistory()

    const [newUser, setNewUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: ""
    })

    const onSubmit = async (e) => {
        e.preventDefault()

        const result = await fetch("http://localhost:5000/new-user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => response.json())
            .then(data => {
                return data
            })

        history.push("/login")
        resetReload(result)
    }

    return (
        <>
            <form onSubmit={(e) => onSubmit(e)}>
                <TextField
                    id="outlined-multiline"
                    label="Firstname"
                    variant="outlined"
                    required
                    onChange={e => setNewUser({
                        firstname: e.target.value,
                        lastname: newUser.lastname,
                        username: newUser.username,
                        password: newUser.password
                    })} />
                <TextField
                    id="outlined-multiline"
                    label="Lastname"
                    variant="outlined"
                    required
                    onChange={e => setNewUser({
                        firstname: newUser.firstname,
                        lastname: e.target.value,
                        username: newUser.username,
                        password: newUser.password
                    })} />
                <TextField
                    id="outlined-multiline"
                    label="Username"
                    variant="outlined"
                    required
                    onChange={e => setNewUser({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        username: e.target.value,
                        password: newUser.password
                    })} />
                <TextField
                    id="outlined-multiline"
                    label="Password"
                    variant="outlined"
                    required
                    onChange={e => setNewUser({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        username: newUser.username,
                        password: e.target.value
                    })} />
                <button className="btn" type="submit">Register</button>
            </form>
            <h4>Have an account? Login {<Link to="/login">here</Link>}</h4>
        </>
    )
}

export default Register