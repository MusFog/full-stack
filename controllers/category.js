const Category = require('../models/Category')
const News = require('../models/News')
const Subscription = require('../models/Subscription')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category
            .find()
            .skip(+req.query.offset)
            .limit(req.query.limit)
        res.status(200).json(categories)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const category = await Category.findById(
            req.params.id
        )
        res.status(200).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteById = async function (req, res) {
    try {
        await Category.deleteOne({
            _id: req.params.id
        })
        await News.deleteMany({
            category: req.params.id
        })
        await Subscription.deleteMany({
            category: req.params.id
        })
        res.status(200).json({
            message: 'Категорія була видалена'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
        user: req.user.id,
        imageSrc: req.file ? req.file.path : ''
    })
    try {
        await category.save()
        res.status(201).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateById = async function (req, res) {
    const updated = {
        name: req.body.name,
        description: req.body.description
    }
    if (req.file) {
        updated.imageSrc = req.file.path
    }

    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updated },
            { new: true }
        )
        res.status(200).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
}


