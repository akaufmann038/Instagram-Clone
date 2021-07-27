import { Button, TextField } from '@material-ui/core';
import { useHistory } from "react-router-dom"

const Login = ({  }) => {
    let history = useHistory()

    const onSubmit = () => {
        
    }

    return (
        <div>
            <Button variant="contained" onClick={() => history.push("/")}>Back</Button>

            <form>
                <TextField id="outlined-multiline" label="Username" variant="outlined" required/>
                <TextField id="outlined-multiline" label="Password" variant="outlined" required/>
                <Button 
                type="submit"
                variant="contained" 
                color="primary" 
                onClick={() => console.log("login")}>Login</Button>
            </form>
        </div>
    )
}

export default Login