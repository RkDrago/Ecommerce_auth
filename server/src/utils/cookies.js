import { config } from '../config/config.js'

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const setRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, refreshTokenCookieOptions)
}

export const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', { ...refreshTokenCookieOptions, maxAge: undefined })
}

export { config as cookieConfig }
