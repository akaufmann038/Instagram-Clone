const express = require("express")
const socket = require("socket.io")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const fs = require("fs")
const path = require("path")

const app = express()
const cors = require("cors")
const User = require("./models/user")
const crypto = require("crypto")

// stores authentication tokens
const authTokens = {}

// connect to database
mongoose.connect("mongodb://127.0.0.1:27017/socialMediaApp", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})

app.use(
    cors({
        origin: "http://localhost:3000"
    })
)

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.use((req, res, next) => {
    const authToken = req.body.authToken
    const currentUser = req.body.userId

    // check if sent authToken exists within authTokens
    if (String(authTokens[authToken]) === String(currentUser)) {
        req.userAuth = authTokens[authToken]
    }

    console.log("done w middle")
    next()
})


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

// creates a new post
app.post("/new-post-v2", upload.single("image"), async (req, res) => {
    const userId = req.body.userId
    const content = req.body.content
    const fileName = req.file.filename
    const contentType = req.file.mimetype

    // read the actual file 
    const imageData = fs.readFileSync(path.join(__dirname + "/uploads/" + fileName))

    const newPost = {
        content: content,
        createdAt: Date.now(),
        imageData: imageData,
        contentType: contentType
    }

    req.user = await User.findById(userId)

    req.user.tweets = [...req.user.tweets, newPost]

    await req.user.save()

    const posts = await User.find().sort({ createdAt: "desc" })

    // delete uploaded file
    await fs.unlink(path.join(__dirname + "/uploads/" + fileName), (err) => {
        if (err) {
            console.log(err)
            return
        }
    })

    res.json({ message: "User authenticated", posts: posts })
})

// gets all app data
app.post("/posts", async (req, res) => {
    if (req.userAuth) {
        const posts = await User.find().sort({ createdAt: "desc" })

        res.json({ message: "User authenticated", posts: posts })
    } else {
        res.json({ message: "User not authenticated" })
    }
})

app.get("/get-tokens", async (req, res) => {
    res.json(authTokens)
})

// modifies a post
app.put("/edit-post", async (req, res) => {
    if (req.userAuth) {
        req.user = await User.findById(req.body.userId)

        req.user.tweets = req.user.tweets.map(post => {
            if (String(post._id) === req.body.post.postId) {
                return {
                    content: req.body.post.content,
                    createdAt: post.createdAt,
                    _id: post._id,
                    contentType: post.contentType,
                    imageData: post.imageData
                }
            } else {
                return post
            }
        })

        await req.user.save()

        const posts = await User.find().sort({ createdAt: "desc" })

        res.json({ message: "User authenticated", posts: posts })
    } else {
        res.json({ message: "User not authenticated" })
    }

})

app.delete("/clear-admin-conversations", async (req, res) => {
    req.user = await User.findById("6104211506badf894ac9e1b2")

    req.user.conversations = []

    await req.user.save()

    res.json("Deleted Admin's conversations!")
})

app.post("/new-conversation", async (req, res) => {
    req.clientUser = await User.findById(req.body.clientUserId)

    req.otherUser = await User.findById(req.body.otherUserId)

    const firstMessage = req.body.firstMessage

    const conversationCreatedAt = Date.now()

    // create the conversation for clientUser
    req.clientUser.conversations = [...req.clientUser.conversations, {
        userId: req.body.otherUserId,
        messages: [{ messageContent: firstMessage, messageCreatedAt: conversationCreatedAt }],
        createdAt: conversationCreatedAt
    }]

    // create the conversation for otherUser
    req.otherUser.conversations = [...req.otherUser.conversations, {
        userId: req.body.clientUserId,
        messages: [],
        createdAt: conversationCreatedAt
    }]

    await req.clientUser.save()
    await req.otherUser.save()

    const posts = await User.find().sort({ createdAt: "desc" })

    res.json(posts)
})

app.put("/send-message", async (req, res) => {
    req.user = await User.findById(req.body.clientUserId)

    let found = false
    req.user.conversations = req.user.conversations.map(convo => {
        // identify current conversation
        if (convo.userId === req.body.otherUserId && !found) {
            found = true
            return {
                createdAt: convo.createdAt,
                messages: [...convo.messages, {
                    messageContent: req.body.message,
                    messageCreatedAt: Date.now()
                }],
                userId: convo.userId,
                _id: convo._id
            }
        } else {
            return convo
        }
    })

    await req.user.save()

    const posts = await User.find().sort({ createdAt: "desc" })

    res.json(posts)
})

// creates a new user
app.post("/new-user", async (req, res) => {
    const hashedPassword = getHashedPassword(req.body.password)

    req.user = new User()
    req.user.firstName = req.body.firstname
    req.user.lastName = req.body.lastname,
        req.user.username = req.body.username,
        req.user.password = hashedPassword,
        req.user.tweets = [],
        req.user.conversations = [],
        req.user.admin = false

    await req.user.save()

    const posts = await User.find().sort({ createdAt: "desc" })

    res.json(posts)
})

app.delete("/delete-user", async (req, res) => {
    let userId = req.body.userId

    try {
        await User.findByIdAndDelete(userId)

        const posts = await User.find().sort({ createdAt: "desc" })

        res.json(posts)
    } catch (e) {
        console.log(e)
    }
})

// deletes a post
app.delete("/delete-post", async (req, res) => {
    if (req.userAuth) {
        let postId = req.body.postId
        let userId = req.body.userId

        req.user = await User.findById(userId)

        req.user.tweets = req.user.tweets.filter(tweet => {
            return (String(tweet._id) !== String(postId))
        })

        await req.user.save()

        const posts = await User.find().sort({ createdAt: "desc" })

        res.json({ message: "User authenticated", posts: posts })
    } else {
        res.json({ message: "User not authenticated" })
    }
})

app.post("/attempt-login", async (req, res) => {
    console.log("attempt-login")
    let logUsername = req.body.username
    let logPassword = req.body.password

    const hashedPassword = getHashedPassword(logPassword)

    // TODO: change this to check using hashedPassword
    req.desiredUser = await User.find({ username: logUsername, password: hashedPassword })

    // user found
    if (req.desiredUser.length === 1) {
        // on login, generate auth token and save it in authTokens
        const authToken = generateAuthToken()
        authTokens[authToken] = req.desiredUser[0]._id

        res.json({
            "message": "User found!",
            "user": req.desiredUser[0],
            "AuthToken": authToken
        })
    }
    else {
        res.json({ "message": "User not found!" })
    }
})


var server = app.listen(5000)

const io = socket(server)

io.use((socket, next) => {
    //console.log("happening")
    const username = socket.handshake.auth.connectedUser

    socket.username = username

    next()
})

io.on("connection", (socket) => {
    console.log("server connected!")
    console.log(socket.username)

    let users = []
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userId: id,
            username: socket.username
        })
    }

    console.log(users)
    // emit connected user data to clients
    io.emit("users", users)

    socket.on("get users", (data) => {
        console.log("sent by: " + data.userId)
        // send back to sending client
        socket.emit("users", users)
    })

    socket.on("new message", (data) => {
        // gets username of client that sent the message
        const sentFrom = users.filter(user => {
            return user.userId === socket.id
        })[0].username

        socket.to(data.otherSocketId).emit("new message", sentFrom)
    })

    socket.on("disconnect", () => {
        console.log("server disconnected!")
        // send something on disconnect to change state of client
    })
})

// if other user is not connected, no emitting of messages
    // on client connection, get all currently connected users
    // NOTE: this requires a data refresh upon entering the message page
// if other user is connected, emit message to that user