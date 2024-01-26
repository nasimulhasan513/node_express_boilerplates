import { json, urlencoded } from 'express'
import cors from 'cors'
import logMiddleware from './logMiddleware'
export default function globalMiddleware (app) {
  app.use(cors())
  app.use(json())
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  app.use(logMiddleware)
}
