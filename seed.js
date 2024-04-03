const mongoose = require('mongoose')
const News = require('./models/News')
const Category = require('./models/Category')
const Subscription = require('./models/Subscription')
const Feedback = require('./models/Feedback')
const User = require('./models/User')
const keys = require("./config/keys")

mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(error))

const categoriesData = [
    { name: 'Категорія 1', description: 'Опис категорії 1' },
    { name: 'Категорія 2', description: 'Опис категорії 2' },
    { name: 'Категорія 3', description: 'Опис категорії 3' },
    { name: 'Категорія 4', description: 'Опис категорії 4' },
    { name: 'Категорія 5', description: 'Опис категорії 5' },
]

const seedCategories = async () => {
    await User.deleteMany()
    await Feedback.deleteMany()
    await Subscription.deleteMany()
    await Category.deleteMany()
    const categories = []

    for (const categoryData of categoriesData) {
        const category = new Category(categoryData)
        await category.save()
        categories.push(category)
    }

    console.log('Categories seeded')
    return categories
}

const seedNews = async (categories) => {
    await News.deleteMany()

    for (const [index, category] of categories.entries()) {
        for (let i = 0; i < 3; i++) {
            const newsIndex = index * 3 + i + 1
            const newsItem = {
                name: `Новина ${newsIndex}`,
                description: `Опис новини ${newsIndex}`,
                articles: [
                    {
                        title: `Стаття 1 новини ${newsIndex}`,
                        news: `Контент статті 1 новини ${newsIndex}`,
                    },
                    {
                        title: `Стаття 2 новини ${newsIndex}`,
                        news: `Контент статті 2 новини ${newsIndex}`,
                    },
                ],
                category: category._id,
                user: null,
            }

            await new News(newsItem).save()
        }
    }

    console.log('News seeded')
}

const seedDB = async () => {
    const categories = await seedCategories()
    await seedNews(categories)
    mongoose.disconnect()
}

seedDB()
