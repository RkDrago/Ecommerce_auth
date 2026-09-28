import bcrypt from 'bcryptjs'
import UserModel from '../models/user.model.js'
import { generateToken, verifyRefreshToken } from '../utils/auth.js'
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookies.js'

const safeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
})

const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists',
            })
        }

        const passwordHash = await bcrypt.hash(password, 12)

        const user = await UserModel.create({ name, email, passwordHash })

        res.status(201).json({
            success: true,
            message: 'Account created successfully. Please login.',
            data: { user: safeUser(user) },
        })
    } catch (error) {
        next(error)
    }
}

const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const { accessToken, refreshToken } = generateToken({ userId: user._id })

        user.refreshToken = refreshToken
        await user.save()

        setRefreshTokenCookie(res, refreshToken)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: safeUser(user),
                accessToken,
            },
        })
    } catch (error) {
        next(error)
    }
}

const refreshTokenController = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token missing. Please login again.',
            })
        }

        let decoded
        try {
            decoded = verifyRefreshToken(token)
        } catch {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token. Please login again.',
            })
        }

        const user = await UserModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token. Please login again.',
            })
        }

        if (user.refreshToken !== token) {
            user.refreshToken = null
            await user.save()

            clearRefreshTokenCookie(res)
            return res.status(403).json({
                success: false,
                message: 'Refresh token reuse detected. Please login again.',
            })
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken({ userId: user._id })

        user.refreshToken = newRefreshToken
        await user.save()

        setRefreshTokenCookie(res, newRefreshToken)

        res.status(200).json({
            success: true,
            message: 'Access token refreshed',
            data: { accessToken },
        })
    } catch (error) {
        next(error)
    }
}

const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken

        if (token) {
            const decoded = verifyRefreshToken(token)
            const user = await UserModel.findById(decoded.id)

            if (user && user.refreshToken === token) {
                user.refreshToken = null
                await user.save()
            }
        }

        clearRefreshTokenCookie(res)

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        })
    } catch (error) {
        next(error)
    }
}

const getMeController = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile fetched successfully',
        data: { user: safeUser(req.user) },
    })
}

const healthCheckController = (req, res) => {
    res.status(200).json({ success: true, message: 'API is running' })
}

export {
    registerUserController,
    loginUserController,
    refreshTokenController,
    logoutUserController,
    getMeController,
    healthCheckController,
}
