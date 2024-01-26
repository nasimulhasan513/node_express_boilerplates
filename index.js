import express from 'express'
import mongoose from 'mongoose'
import globalMiddleware from './src/middlewares/globalMiddleware'
import routes from './src/routes'
import { DB_URL } from './config'
import errorHandler from './src/middlewares/errorHandler'
const app = express()
globalMiddleware(app)

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (err) => {
  console.error.bind(err)
})
db.once('open', () => {
  console.log('Database connected...')
})

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  })
})
app.use('/api', routes)
app.use(errorHandler)
const PORT = process.env.PORT || 3200
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
