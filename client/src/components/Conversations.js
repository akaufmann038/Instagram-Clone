import { Button } from '@material-ui/core'
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Convo from './Convo'

const Conversations = ({ userData, useAuth, resetReload }) => {
    let history = useHistory()
    const [myMessages, setMyMessages] = useState([])
    const [otherMessages, setOtherMessages] = useState([])
    const [messages, setMessages] = useState([])

    let { path, url } = useRouteMatch()
    let auth = useAuth()

    // get conversations for current user
    const myConversations = userData.find(user => {
        return user._id === auth.user
    }).conversations

    // left off here. was about to finish conversations page
    return (
        <Switch>
            <Route exact path={path}>
                <div>
                    <h4>Hello from Conversations Page!</h4>
                    {myConversations.map((element, key) => {
                        return (
                            <section key={key}>
                                Conversation with {element.userId}
                                <Button 
                                variant="contained" 
                                onClick={() => history.push("/conversations/" + element.userId)}>Enter Conversation</Button>
                            </section>
                        )
                    })}
                    <Button variant="contained" color="primary" onClick={() => history.push("/home")}>Home</Button>
                </div>
            </Route>
            <Route path={`${path}/:otherUserId`}>
                <Convo useAuth={useAuth} userData={userData} resetReload={resetReload} />
            </Route>
        </Switch>
    )
}

export default Conversations