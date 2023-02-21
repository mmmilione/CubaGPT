import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    alias: String,
    credits: Number
})

export default userSchema;