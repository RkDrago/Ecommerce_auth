import app from './app/app.js'
import { config } from './config/config.js'
import { connectDb } from './config/db.config.js'
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

await connectDb()

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})
