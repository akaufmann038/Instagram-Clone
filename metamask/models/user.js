const mongoose = require("mongoose")


const model = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        tweets:
            [
                {
                    content: String,
                    id: mongoose.Types.ObjectId
                }
            ],
            admin: {
                type: Boolean,
                required: true
            }
    })


module.exports = mongoose.model("user", model)