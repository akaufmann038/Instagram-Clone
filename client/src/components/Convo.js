import { useParams, useHistory } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { TextField, Button } from '@material-ui/core'
import { socket } from '../service/socket'

// LEFT OFF IN HERE
// see what happens when there are two chats happening between four live users
// is there web socket interferance between them?
const Convo = ({ useAuth, userData, resetReload, otherConnected, changeOtherConnected }) => {
    const [newMessage, setNewMessage] = useState()
    const [newConversation, setNewConversation] = useState(true)
    //const [otherConnected, setOtherConnected] = useState({ connected: false, socketId: "" })
    //const otherConnected = useRef({ connected: false, socketId: "" })

    let auth = useAuth()
    let history = useHistory()
    let { otherUserId } = useParams()

    // refresh data in application
    const refetchData = async () => {
        //setLoading(true)

        const result = await fetch("http://localhost:5000/posts")
            .then(response => response.json())
            .then(data => {
                return data
            })

        console.log("data reloaded")
        await resetReload(result)
        //socket.emit("get users", { userId: socket.id })
    }

    // get data for client user
    const clientUser = userData.find(user => {
        return user._id === auth.user
    })

    // get data for other user
    const otherUser = userData.find(user => {
        return user._id === otherUserId
    })

    // returns true if conversation exists and false if not
    const getConvoExist = () => {
        let clientExists = false
        let otherExists = false

        clientUser.conversations.forEach(convo => {
            if (convo.userId === otherUserId) {
                clientExists = true
            }
        })

        otherUser.conversations.forEach(convo => {
            if (convo.userId === auth.user) {
                otherExists = true
            }
        })

        return clientExists && otherExists
    }

    const convoExists = getConvoExist()


    let clientMessages = []
    let otherMessages = []
    // get client and other user messages
    if (convoExists) {
        clientMessages = clientUser.conversations.find(conversation => {
            return conversation.userId === otherUserId
        }).messages
        otherMessages = otherUser.conversations.find(conversation => {
            return conversation.userId === auth.user
        }).messages
    }

    // orders messages
    const allMessages = clientMessages.concat(otherMessages).sort(function (a, b) {
        const bDate = new Date(b.messageCreatedAt)
        const aDate = new Date(a.messageCreatedAt)

        const earlier = aDate - bDate

        return earlier
    })

    useEffect(() => {
        setNewConversation(!convoExists)
    }, [convoExists])

    useEffect(() => {
        socket.auth = { connectedUser: auth.user }
        socket.connect()

        const newMessageHandler = async (data) => {
            //console.log(msg)
            refetchData()
            //usersHandler(data)
        }

        const usersHandler = (connectedUsers) => {
            console.log(connectedUsers)

            // if other user is connected, set otherConnected state to true
            // otherwise, it stays false
            connectedUsers.forEach(user => {
                if (user.username === otherUserId) {
                    // set state to connected with socket id of other user
                    //setOtherConnected({ connected: true, socketId: user.userId })
                    //otherConnected.current = { connected: true, socketId: user.userId }
                    changeOtherConnected({ connected: true, socketId: user.userId })
                }
            })
        }
        
        socket.on("new message", newMessageHandler)

        socket.on("users", usersHandler)

        return () => {
            socket.off("new message", newMessageHandler)
            socket.off("users", usersHandler)
        }
    }, [])

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

        // no emitting necessary in start conversation because other user cannot be connected to socket
        //socket.emit("new message", "conversation created")
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

        if (otherConnected.connected) {
            socket.emit("new message", { otherSocketId: otherConnected.socketId })
        }
        resetReload(result)
    }

    const onBack = () => {
        socket.disconnect()
        history.push("/home")
    }

    const onEmit = () => {
        socket.emit("new message", { otherSocketId: otherConnected.socketId })
    }

    return (
        <div>
            <h4>Message: {newMessage}</h4>
            <h4>newConversation?: {String(newConversation)}</h4>
            <section>
                Messages:
                {allMessages.map(message => {
                return <h4 key={message._id}>{message.messageContent}</h4>
            })}
            </section>
            <form onSubmit={newConversation ? (e) => startConversation(e) : (e) => sendMessage(e)}>
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
                onClick={() => onBack()}>Back</Button>
            <Button onClick={() => onEmit()}>Emit Message</Button>
            <h4>OtherSocketId: {otherConnected.socketId}</h4>
            {/* <Button onClick={() => console.log(otherConnected.current)}>Print otherConnected</Button> */}
        </div>
    )
}

export default Convo