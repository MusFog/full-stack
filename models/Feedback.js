const mongoose = require('mongoose')
const Schema = mongoose.Schema
const feedbackSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    adminResponses: [{
        response: String,
        respondedAt: Date,
        _id: false
    }],
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
}, { timestamps: true })

module.exports = mongoose.model('feedbacks', feedbackSchema)