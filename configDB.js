import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGO_URI;

export default async function connectDB() {
    try {
        mongoose.connect(uri);

        console.log("Database is Connected...!");
    } catch (error) {
        console.log("Database Error", error);
    }
}
