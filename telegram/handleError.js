import { saveMSG } from "../models/handleData.js";

const handleError = async (error, ctx, msg) => {
    console.log(error);
    const sendReply = await ctx.reply(msg);
    saveMSG(ctx, msg, sendReply.message_id, false);
}

export default handleError;