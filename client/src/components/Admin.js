import { Card, CardContent, Container, CardActions, Button, TextField } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import { useHistory } from "react-router-dom"
import { useState, useEffect } from "react"

const useStyles = makeStyles({
    card: {
        marginTop: "15px",
        marginLeft: "30%",
        marginRight: "30%",
        background: "radial-gradient(circle, rgba(63,94,255,1) 0%, rgba(239,157,240,1) 100%)"
    }
})

const Admin = ({ userData, handleUsers }) => {
    let history = useHistory()
    const styles = useStyles()

    const [newUser, setNewUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: ""
    })
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)

    const resetReloadAdmin = () => {
        setReload(!reload)
    }

    // useEffect(() => {
    //     setLoading(true)
    //     fetch("http://localhost:5000/posts")
    //         .then(response => {
    //             if (response.ok) {
    //                 return response.json()
    //             }
    //             throw response
    //         })
    //         .then(data => {
    //             handleUsers(data)
    //         })
    //         .then(() => setLoading(false))
    //         .finally(() => console.log("done fetching data!"))
    // }, [reload])

    const deleteUser = async (userId) => {
        await fetch("http://localhost:5000/delete-user", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        })
            .then(response => console.log(response))
            .then(() => resetReloadAdmin())
    }

    const createUser = async (e) => {
        e.preventDefault()

        await fetch("http://localhost:5000/new-user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(response => console.log(response))
            .then(() => resetReloadAdmin())
            //.then(() => history.push("/home"))
    }

    return (
        <div>
            <Container>
                <Button onClick={() => history.push("/home")} variant="contained" color="secondary">Back</Button>
                {userData.map((element, idx) => {
                    return <Card className={styles.card} key={idx}>
                        <CardContent>
                            Firstname: {element.firstName}
                        </CardContent>
                        <CardContent>
                            Lastname: {element.lastName}
                        </CardContent>
                        <CardContent>
                            Username: {element.username}
                        </CardContent>
                        <CardContent>
                            Password: {element.password}
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => deleteUser(element._id)} variant="contained" color="secondary">Delete User</Button>
                        </CardActions>
                    </Card>
                })}
            </Container>
            <form onSubmit={(e) => createUser(e)}>
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary">Create User</Button>
            </form>
        </div>
    )
}

export default Admin