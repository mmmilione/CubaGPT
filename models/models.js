import mongoose from "mongoose"
import msgSchema from "./schema/msgSchema.js";
import userSchema from "./schema/userSchema.js";

const Messages = new mongoose.model("Messages", msgSchema);
const Users = new mongoose.model("Users", userSchema);

export { Messages, Users };