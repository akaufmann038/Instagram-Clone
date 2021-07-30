import {
    Route,
    Redirect
  } from "react-router-dom";

const PrivateAdminRoute = ({ children, useAuth, userData, ...rest }) => {
    let auth = useAuth()

    const currentUser = userData.find(user => {
        return (user._id === auth.user)
    })

    return (
        <Route {...rest} render={({ location }) =>
            (auth.user && currentUser.admin) ? (children) : (<Redirect to={{ pathname: "/home", state: { from: location } }}/>)}/>
    )
}

export default PrivateAdminRoute
