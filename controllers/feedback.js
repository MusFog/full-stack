const Feedback = require('../models/feedback')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function(req, res) {

    try {
        const feedback = await new Feedback({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
        }).save()
        res.status(201).json(feedback)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAll = async function(req, res) {
    try {
        const feedbacks = await Feedback
            .aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user_details"
                    }
                },
                {
                    $unwind: "$user_details"
                },
                {
                    $sort: {
                        "user_details.login": 1,
                        "createdAt": -1
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        adminResponses: 1,
                        "user.login": "$user_details.login",
                    }
                }
            ])
        res.json(feedbacks)
    } catch (e) {
        errorHandler(res, e)
    }
}



module.exports.getById = async function(req, res) {
    try {
        const feedback = await Feedback.findById(req.params.id)
        res.json(feedback)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateById = async function(req, res) {
    try {
        const feedbackUpdate = {
            $push: { adminResponses: { response: req.body.adminResponse, respondedAt: new Date() } }
        }

        const feedback = await Feedback.findOneAndUpdate(
            { _id: req.params.id },
            feedbackUpdate,
            { new: true }
        )
        res.json(feedback)
    } catch (e) {
        errorHandler(res, e)
    }
}
