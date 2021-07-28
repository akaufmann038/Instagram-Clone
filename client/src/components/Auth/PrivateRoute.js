import {
    Route,
    Redirect
  } from "react-router-dom";

const PrivateRoute = ({ children, useAuth, ...rest }) => {
    let auth = useAuth()

    return (
        <Route {...rest} render={({ location }) =>
            auth.user ? (children) : (<Redirect to={{ pathname: "/login", state: { from: location } }}/>)}/>
    )
}

export default PrivateRoute