const Subscription = require('../models/Subscription')
const errorHandler = require('../utils/errorHandler')

exports.createSubscription = async (req, res) => {
    const user = req.user.id
    const category = req.body.category
    try {
        const existingSubscription = await Subscription.findOne({ user, category })
        if (existingSubscription) {
            await Subscription.deleteOne({ user, category })
            return res.status(200).json({ message: 'Ви успішно відписані від цієї категорії.'})
        }
        const subscription = new Subscription({ user, category })
        await subscription.save()
        res.status(201).json(subscription)
    } catch (e) {
        errorHandler(res, e)
    }
}


