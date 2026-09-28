import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from '../routes/authRouter.js'
import productRouter from '../routes/productRouter.js'
import { config } from '../config/config.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: config.CLIENT_ORIGIN,
    credentials: true,
}))

// health check
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'E-commerce API is running',
    })
})

app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)

// 404 for unknown API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    })
})
// handles error
app.use((error, req, res, next) => {
    console.error(error)

    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid id format' })
    }

    if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'Duplicate value' })
    }

    res.status(error.status || 500).json({
        success: false,
        message: error.status ? error.message : 'Internal server error',
    })
})

export default app
