import logger from '../../config/logger'

export default (req, res, next) => {
  logger.info(`Request received: ${req.method} ${req.originalUrl} `)
  next()
}
