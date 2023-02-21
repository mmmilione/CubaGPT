import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    userID: String,
    msgID: String,
    time: Number,
    msg: String,
    isAIgenerated: Boolean,
})

export default msgSchema;