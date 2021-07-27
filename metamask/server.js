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
        content: req.body.post.content
    }

    // const newPost = {
    //     content: req.body.post.content,
    //     id: Math.floor(Math.random() * 100)
    // }

    req.user = await User.findById(userId)

    req.user.tweets = [...req.user.tweets, newPost]

    await req.user.save()
})

app.post("/new-user", async (req, res) => {
    req.post = new User()
    req.post.firstName = "Alexander"
    req.post.lastName = "Kaufmann",
        req.post.username = "akaufmann",
        req.post.password = "withLove101",
        req.post.tweets = [],
        req.post.admin = false

    await req.post.save()
})

app.delete("/delete-user", async (req, res) => {
    let userId = req.body.userId

    try {
        await User.findByIdAndDelete(userId)
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