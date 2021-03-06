const express = require("express")
const socket = require("socket.io")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
var session = require("express-session")
const mongoose = require("mongoose")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const fs = require("fs")
const path = require("path")

const app = express()
const cors = require("cors")
const User = require("./models/user")
const crypto = require("crypto")

app.use(
    cors({
        origin: "http://localhost:3000"
    })
)

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../metamask/build')));

app.use(session({
    secret: "keyboard cat",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}))

const certificatePath = path.join(__dirname + "/certificates/mongoCertificate.crt")

mongoose.connect("mongodb://localhost:27017/test", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})

app.use((req, res, next) => {
    
    const authToken = req.body.authToken
    const currentUser = req.body.userId

    if (req.session.authToken && req.session.authToken.token === authToken && 
        req.session.authToken.userId === String(currentUser)) {
        req.userAuth = true;
    } else {
        req.userAuth = false
    }
    
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
    const authToken = req.body.authToken
    const fileName = req.file.filename
    const contentType = req.file.mimetype

    let isAuthenticated;

    if (String(authTokens[authToken]) === String(userId)) {
        isAuthenticated = authTokens[authToken]
    }

    if (isAuthenticated) {
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
    } else {
        res.json({ message: "User not authenticated" })
    }


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

app.get("/getdata", async (req, res) => {
    const data = await User.find()

    res.json({ data: data })
})

app.get("/deletedata", async (req, res) => {
    await User.deleteMany({ firstName: "admin" })

    res.json({ message: "Success!" })
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

// begin a new conversation
app.post("/new-conversation", async (req, res) => {
    if (req.userAuth) {
        req.clientUser = await User.findById(req.body.userId)

        req.otherUser = await User.findById(req.body.otherUserId)

        // verify that conversation does not already exist with other user
        let convoExists = false

        req.clientUser.conversations.forEach(convo => {
            if (convo.userId == req.body.otherUserId) {
                convoExists = true
            }
        })

        if (!convoExists) {
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
                userId: req.body.userId,
                messages: [],
                createdAt: conversationCreatedAt
            }]

            await req.clientUser.save()
            await req.otherUser.save()

            const posts = await User.find().sort({ createdAt: "desc" })

            res.json({ message: "User authenticated", posts: posts })
        } else {
            res.json({ message: "Conversation already exists!" })
        }

    } else {
        req.json({ message: "User not authenticated" })
    }
})

// sends a new message in the conversation
app.put("/send-message", async (req, res) => {
    if (req.userAuth) {
        req.user = await User.findById(req.body.userId)

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

        res.json({ message: "User authenticated", posts: posts })
    } else {
        res.json({ message: "User not authenticated" })
    }
})

// app.get("/delete-arion", async (req, res) => {
//     await User.deleteMany({ lastName: "Sadat" })

//     res.json({ message: "Success!" })
// })

// creates a new user
app.post("/new-user", async (req, res) => {
    const hashedPassword = getHashedPassword(req.body.password)

    req.user = new User()
    req.user.firstName = req.body.firstname
    req.user.lastName = req.body.lastname
    req.user.username = req.body.username

    const existingUsers = await User.find({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username
    })

    if (existingUsers.length === 0) {
        req.user.password = hashedPassword
        req.user.tweets = []
        req.user.conversations = []
        req.user.admin = true

        await req.user.save()

        const posts = await User.find().sort({ createdAt: "desc" })

        res.json({ message: "Successful", posts: posts })
    } else {
        res.json({ message: "User already exists" })
    }


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

// for testing purposes
app.get("/test-auth", async (req, res) => {
    if (req.userAuth) {
        res.json({ message: "User authenticated" })
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
        //authTokens[authToken] = req.desiredUser[0]._id

        req.session.authToken = { token: authToken, userId: req.desiredUser[0]._id}


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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
});


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