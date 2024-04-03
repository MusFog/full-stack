const mongoose = require('mongoose')
const Schema = mongoose.Schema
const subscriptionSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true },
});

module.exports = mongoose.model('subscriptions', subscriptionSchema);