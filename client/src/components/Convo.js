import { useParams, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TextField, Button } from '@material-ui/core'

const Convo = ({ useAuth, userData, resetReload }) => {
    const [newMessage, setNewMessage] = useState()
    const [newConversation, setNewConversation] = useState(true)

    let auth = useAuth()
    let history = useHistory()
    let { otherUserId } = useParams()

    // get conversation for current user
    const myConversation = userData.find(user => {
        return user._id === auth.user
    }).conversations.find(conversation => {
        return conversation.userId === otherUserId
    })

    // get conversation of opposite user
    const otherConversation = userData.find(user => {
        return user._id === otherUserId
    }).conversations.find(conversation => {
        return conversation.userId === auth.user
    })

    useEffect(() => {
        setNewConversation(myConversation === undefined && otherConversation === undefined)
    }, [myConversation, otherConversation])

    // starts a conversation with the first message from the client
    const startConversation = async (e) => {
        e.preventDefault()

        const result = await fetch("http://localhost:5000/new-conversation", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientUserId: auth.user,
                otherUserId: otherUserId,
                firstMessage: newMessage
            })
        })
            .then(response => response.json())
            .then(data => {
                return data
            })

        resetReload(result)
        //console.log(result)
    }

    // send a message in the already existing converation
    const sendMessage = async (e) => {
        e.preventDefault()

        const result = await fetch("http://localhost:5000/send-message", {
            method: "PUT",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                clientUserId: auth.user,
                otherUserId: otherUserId,
                message: newMessage
            })
        })
        .then(response => response.json())
        .then(data => {
            return data
        })

        console.log(result)
        resetReload(result)
    }

    // LEFT OFF HERE
    // next up is to display the actual conversation

    return (
        <div>
            <h4>Message: {newMessage}</h4>
            <h4>newConversation?: {String(newConversation)}</h4>
            <form onSubmit={newConversation ? (e) => startConversation(e): (e) => sendMessage(e)}>
                <TextField
                    id="outlined-multiline"
                    label="Message"
                    variant="outlined"
                    required
                    onChange={e => setNewMessage(e.target.value)} />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary">Send</Button>
            </form>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => history.push("/home")}>Back</Button>
        </div>
    )
}

export default Convo