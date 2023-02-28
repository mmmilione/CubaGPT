import {Telegraf} from "telegraf";
import { addUser, deleteAllMSGs, deleteUser, fetchAllMSGs, lastMSG, saveMSG } from "../models/handleData.js";
import generateReplay from "../ai/useOpenAi.js";
import { isAllowed, isAdmin } from "./accessControl.js";
import { errorAlert, help, notAllowed, welcome, added, cancelled } from "./texts.js";
import handleError from "./handleError.js";

const botInit = async () => {
    
    console.log("Bot is Going live");
    const bot = new Telegraf(process.env.TELEGRAF_API);

    bot.use(async(ctx, next) => {
        try{
            const isUserAllowed = await isAllowed(ctx.message.from.username);
            if( isUserAllowed == true ) {
                //Save user comand
                await saveMSG(ctx, ctx.message.text, ctx.message.message_id, false);
                return next();
            } else {
                console.log("User ", ctx.message.from.username, " NOT Allowed");
                handleError(null, ctx, notAllowed);
            }
        }catch(error){
            handleError(error, ctx, notAllowed);
        }
    });

    bot.start(async (ctx) => {
        try{
            const sendReply = await ctx.reply(welcome);
            saveMSG(ctx, welcome, sendReply.message_id, false);
        } catch (error) {
            handleError(error, ctx, errorAlert);
        }
    });

    bot.help(async (ctx) => {
        try {
            const sendReply = await ctx.reply(help);
            saveMSG(ctx, help, sendReply.message_id, false);
        } catch (error) {
            handleError(error, ctx, errorAlert);
        } 
    });

    bot.command('user', isAdmin, async (ctx) => {
        try {
            console.log(ctx.message.text);
            await addUser(ctx.message.text.split(' ')[1]);
            const sendReply = await ctx.reply(added);
            saveMSG(ctx, added, sendReply.message_id, false);
        } catch (error) {
            handleError(error, ctx, errorAlert);
        }
    });

    bot.command('delete', isAdmin, async (ctx) => {
        try {
            console.log(ctx.message.text);
            await deleteUser(ctx.message.text.split(' ')[1]);
            const sendReply = await ctx.reply(cancelled);
            saveMSG(ctx, cancelled, sendReply.message_id, false);
        } catch (error) {
            handleError(error, ctx, errorAlert);
        }
    });
    
    bot.command(['new', 'reset'], async (ctx) => {
        try{
            const msgListToBeDeleted = await fetchAllMSGs(ctx);
            await deleteAllMSGs(ctx);
            for(let i = 0; i < msgListToBeDeleted.length; i++) {
                await ctx.deleteMessage(msgListToBeDeleted[i].msgID);
            }
        } catch (error) {
            handleError(error, ctx, errorAlert);
        }
    });

    bot.on('message', async (ctx) => {
        try {
            
            //Show Typing to user
            ctx.sendChatAction('typing');

            //Fetch previous AI answer for context and use it to create new answer
            const previousAnswer = await lastMSG(ctx);
            console.log("Previous ANSWER: ", previousAnswer);
            const aiReply = await generateReplay(ctx.message.text, previousAnswer);
            
            //Send Reply and Save it in DB
            const sendReply = await ctx.reply(aiReply);
            saveMSG(ctx, aiReply, sendReply.message_id, true);

        } catch (error) {
            handleError(error, ctx, errorAlert);
        }
        
    });

    bot.launch();
    
    return bot;
}

export default botInit;
