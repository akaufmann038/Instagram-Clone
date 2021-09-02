import { useState } from "react"
import { Link, useHistory } from 'react-router-dom'

const Register = ({ resetReload }) => {
    let history = useHistory()

    const [newUser, setNewUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: ""
    })

    const onSubmit = async (e) => {
        e.preventDefault()

        const result = await fetch("/new-user", {
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
                    <h1 className="h3 mb-3 fw-normal">Register here</h1>
                    <div className="form-floating">
                        <input className="form-control" placeholder="Firstname"
                            onChange={e => setNewUser({
                                firstname: e.target.value,
                                lastname: newUser.lastname,
                                username: newUser.username,
                                password: newUser.password
                            })} required />
                        <label>Firstname</label>
                    </div>
                    <div className="form-floating">
                        <input className="form-control" placeholder="Lastname"
                            onChange={e => setNewUser({
                                firstname: newUser.firstname,
                                lastname: e.target.value,
                                username: newUser.username,
                                password: newUser.password
                            })} required />
                        <label>Lastname</label>
                    </div>
                    <div className="form-floating">
                        <input className="form-control" placeholder="Username"
                            onChange={e => setNewUser({
                                firstname: newUser.firstname,
                                lastname: newUser.lastname,
                                username: e.target.value,
                                password: newUser.password
                            })} required />
                        <label>Username</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" class="form-control" placeholder="Password"
                            onChange={e => setNewUser({
                                firstname: newUser.firstname,
                                lastname: newUser.lastname,
                                username: newUser.username,
                                password: e.target.value
                            })} required />
                        <label>Password</label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
                </form>
                <h5>Already have an account? Login {<Link to="login">Here</Link>}</h5>
            </main>
        </div>
    )
}

export default Register