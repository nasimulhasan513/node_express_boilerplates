import { Router } from 'express'
import authController from '../controllers/authController'
import userController from '../controllers/userController'
import auth from '../middlewares/authMiddleware'
const router = Router()
router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.get('/me', auth, authController.me)
router.get('/users', auth, userController.index)
export default router
