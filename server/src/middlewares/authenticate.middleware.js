import { verifyAccessToken } from '../utils/auth.js'
import UserModel from '../models/user.model.js'

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.',
            })
        }

        const accessToken = authHeader.split(' ')[1]

        let decoded
        try {
            decoded = verifyAccessToken(accessToken)
        } catch (error) {
            
            return res.status(401).json({
                success: false,
                message: error.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token',
            })
        }

        const user = await UserModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists',
            })
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export default authenticate
