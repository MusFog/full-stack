const News = require('../models/News')
const errorHandler = require('../utils/errorHandler')
const sendEmailToSubscribers = require("../services/sendEmailToSubscribers.service")


module.exports.getAll = async function (req, res) {
    const query = {}
    let categoryIds = req.query.categoryId

    if (categoryIds) {
        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds]
        }
        query.category = {$in: categoryIds}
    }
    if (req.query.news) {
        query.news = +req.query.news
    }
    try {
        const news = await News
            .find(query)
            .skip(+req.query.offset)
            .limit(req.query.limit)
        res.status(200).json(news)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const news = await News.findById(req.params.id)
            .populate('user', 'login')
            .populate({
                path: 'comment.user',
                select: 'login'
            })
        res.status(200).json(news)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.create = async function (req, res) {
    try {
        const lastNews = await News.findOne({user: req.user.id}).sort({date: -1})
        const maxNews = lastNews ? lastNews.news : 0

        const news = new News({
            name: req.body.name,
            description: req.body.description,
            articles: req.body.articles,
            user: req.user.id,
            category: req.body.category,
            news: maxNews + 1
        })
        const savedNews = await news.save()
        sendEmailToSubscribers(savedNews.category, savedNews.description)
        res.status(201).json(savedNews)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.deleteById = async function (req, res) {
    try {
        await News.deleteOne({
            _id: req.params.id
        })
        res.status(200).json({
            message: 'Новина була видалена'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateById = async function (req, res) {
    const updated = {
        name: req.body.name,
        articles: req.body.articles,
        category: req.body.category,
        description: req.body.description
    }
    if (req.file) {
        updated.imageSrc = req.file.path
    }

    try {
        const news = await News.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(news)
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.addCommentToNews = async (req, res) => {
    try {
        const addComment = await News.updateOne(
            {_id: req.params.id},
            {$push: {comment: {text: req.body.text, user: req.user._id}}}
        )
        res.status(201).json(addComment)
    } catch (e) {
        errorHandler(res, e)
    }
}

