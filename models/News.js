const mongoose = require('mongoose')
const Schema = mongoose.Schema
const newsSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    articles: [
        {
            title: {
                type: String,
                required: true
            },
            news: {
                type: String,
                required: true,
            },
        }
    ],
    comment: [
        {
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            user: {
                ref: 'users',
                type: Schema.Types.ObjectId
            }
        }
    ],
    category: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('news', newsSchema)