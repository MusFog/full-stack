const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const News = require("../models/News")

module.exports.getAll = async function (req, res) {
    try {
        const news = await News.find().distinct('user')
        const author = await User.find({
            '_id': { $in: news }
        }).select('login')

        res.status(200).json(author)
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.getNewsByAuthor = async function (req, res) {
    try {
        const authorId = req.params.id
        const authorNews = await News.find({ user: authorId })

        if (!authorNews.length) {
            return res.status(404).json({ message: 'Новини від цього автора не знайдено' });
        }
        res.status(200).json(authorNews)
    } catch (e) {
        errorHandler(res, e)
    }
}
