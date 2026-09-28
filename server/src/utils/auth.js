import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { config } from '../config/config.js'

export const generateAccessToken = ({ userId }) => {
    return jwt.sign({ id: userId }, config.ACCESS_TOKEN_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
    })
}

export const generateRefreshToken = ({ userId }) => {
    return jwt.sign({ id: userId, jti: crypto.randomUUID() }, config.REFRESH_TOKEN_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    })
}

export const generateToken = ({ userId }) => {
    return {
        accessToken: generateAccessToken({ userId }),
        refreshToken: generateRefreshToken({ userId }),
    }
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET)
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET)
}
