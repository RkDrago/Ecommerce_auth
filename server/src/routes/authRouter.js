import express from 'express'
import { registerUserController, loginUserController, refreshTokenController, logoutUserController, getMeController, } from '../controllers/auth.controller.js'
import { registerValidator, loginValidator } from '../validators/auth.validators.js'
import validate from '../middlewares/validate.middleware.js'
import authenticate from '../middlewares/authenticate.middleware.js'

const router = express.Router()

router.post('/register', registerValidator, validate, registerUserController)
router.post('/login', loginValidator, validate, loginUserController)
router.post('/refresh-token', refreshTokenController)
router.post('/logout', logoutUserController)
router.get('/me', authenticate, getMeController)

export default router
