const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
const User = require("./models/user")

app.use(
    cors({
        origin: "http://localhost:3000"
    })
)

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/socialMediaApp", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})

app.get("/posts", async (req, res) => {
    const posts = await User.find().sort({ createdAt: "desc" })

    res.json(posts)
})

app.post("/new-post", async (req, res) => {
    // TODO: generate a post id 
    const userId = req.body.userId
    const newPost = {
        content: req.body.post.content,
        createdAt: Date.now()
    }

    // const newPost = {
    //     content: req.body.post.content,
    //     id: Math.floor(Math.random() * 100)
    // }

    req.user = await User.findById(userId)

    req.user.tweets = [...req.user.tweets, newPost]

    await req.user.save()

    const posts = await User.find().sort({ createdAt: "desc" })

    res.json(posts)
})

app.put("/edit-post", async (req, res) => {
    // LEFT OFF HERE
    req.user = await User.findById(req.body.userId)

    req.user.tweets = req.user.tweets.map(post => {
        if (String(post._id) === req.body.post.postId) {
            return {
                content: req.body.post.content,
                createdAt: post.createdAt,
                _id: post._id
            }
        } else {
            return post
        }
    })

    await req.user.save()

    const posts = await User.find().sort({ createdAt: "desc" })

    res.json(posts)
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

app.post("/new-user", async (req, res) => {
    req.user = new User()
    req.user.firstName = req.body.firstname
    req.user.lastName = req.body.lastname,
    req.user.username = req.body.username,
    req.user.password = req.body.password,
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

app.delete("/delete-post", async (req, res) => {
    let postId = req.body.postId
    let userId = req.body.userId

    req.user = await User.findById(userId)

    req.user.tweets = req.user.tweets.filter(tweet => {
        return (String(tweet._id) !== String(postId))
    })

    await req.user.save()

    const posts = await User.find().sort({ createdAt: "desc" })

    res.json(posts)
})

app.post("/attempt-login", async (req, res) => {
    let logUsername = req.body.username
    let logPassword = req.body.password

    req.desiredUser = await User.find({ username: logUsername, password: logPassword })

    // user found
    if (req.desiredUser.length === 1) {
        res.json({ "message": "User found!", "user": req.desiredUser[0] })
    }
    else {
        res.json({ "message": "User not found!" })
    }
})


app.listen(5000)