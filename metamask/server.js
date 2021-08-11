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

// const savePost = async (req, res) => {
//     let newPost = req.post

//     // add fields to post
//     newPost.content = req.body.content
//     newPost.id = req.body.id

//     // save in database
//     await req.post.save()
// }

app.listen(5000)