import mongoose from "mongoose";
import botInit from "../telegram/telegramRoutes.js";

const db = async () => {
    try {
        const options = { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        };
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.CONNECTION, options);
        console.log("Connected To Mongo DB");
        botInit();
    } catch (error) {
        console.log(error);
    }
}

export default db;