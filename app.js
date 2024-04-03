const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const categoryPaginationRoutes = require('./routes/categoryPagination')
const newsRoutes = require('./routes/news')
const newscommentRoutes = require('./routes/newscomment')
const authorRoutes = require('./routes/author')
const feedbackRoutes = require('./routes/feedback')
const subscriptionsRoutes = require('./routes/subscription')
const keys = require('./config/keys')
const path = require("path");
const app = express()

mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use('/uploads', express.static('uploads'))
app.use(require('cors')())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/categoryAll', categoryPaginationRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/news/comment', newscommentRoutes)
app.use('/api/author', authorRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/subscriptions', subscriptionsRoutes)

if (process.env.NODE_ENV === 'position') {
    app.use(express.static('client/dist/client/browser'))
    app.get('*', (req, res) =>{
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'browser', 'index.html'
            )
        )
    })
}

module.exports = app