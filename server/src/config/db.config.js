import mongoose from 'mongoose'
import { config } from './config.js';

export const connectDb = async ()=>{
    try {
        await mongoose.connect(config.LOCAL_DB_URI)
        console.log("DB connected successfully");
    } catch (error) {
        console.log("error in connecting DB");        
    }
}