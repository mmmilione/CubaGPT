import { Users } from "../models/models.js";
import handleError from "./handleError.js";

const isAllowed = async (username) => {
    if(process.env.ISFREEACCESS == true) return true;
    const query = { alias: username };
    const user = await Users.findOne(query);
    if(!user) return false;
    return true;
}

const isAdmin = (ctx, next) => {
    console.log("Triggered isAdmin MW");
    if(ctx.message.from.username != process.env.ADMIN){
        return handleError(null, ctx, notAllowed);
    };
    next();
}

export { isAdmin, isAllowed };