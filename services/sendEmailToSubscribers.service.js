const nodemailer = require("nodemailer")
const Subscription = require("../models/Subscription")
const Category = require("../models/Category")

async function sendEmailToSubscribersService(categoryId, description) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "full84132@gmail.com",
            pass: "olad vpwy nhwz zthh",
        },
    })

    try {
        const category = await Category.findById(categoryId)
        const subscriptions = await Subscription.find({ category: categoryId }).populate('user')

        for (let sub of subscriptions) {
            await transporter.sendMail({
                from: '"UKR.NET" <UKR.NET@gmail.com>',
                to: sub.user.email,
                subject: `Опублікована нова новина з категорії ${category.name}`,
                text: `Опис новини: ${description}`,
            })
        }
    } catch (error) {
        console.error("Помилка при відправленні листів: ", error)
    }
}
module.exports = sendEmailToSubscribersService