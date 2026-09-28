import app from './app/app.js'
import { config } from './config/config.js'
import { connectDb } from './config/db.config.js'

await connectDb()

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})
