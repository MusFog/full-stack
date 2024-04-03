const Category = require('../models/Category')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {

    try {
        const [categories, total] = await Promise.all([
            Category.find().skip(+req.query.offset).limit(req.query.limit),
            Category.countDocuments()
        ])

        res.status(200).json({
            data: categories,
            total
        })
    } catch (e) {
        errorHandler(res, e)
    }
}




