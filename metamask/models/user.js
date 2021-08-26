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
                    createdAt: Date,
                    imageData: Buffer,
                    contentType: String,
                    id: mongoose.Types.ObjectId
                }
            ],
        conversations: [{
            userId: String, // userId of the opposite conversation user
            messages: [{
                messageContent: String,
                messageCreatedAt: Date
            }],
            createdAt: Date
        }],
        admin: {
            type: Boolean,
            required: true
        }
    })


module.exports = mongoose.model("user", model)