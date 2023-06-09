import {Telegraf} from "telegraf";
import { addUser, deleteAllMSGs, deleteUser, fetchAllMSGs, saveMSG } from "../models/handleData.js";
import generateReplay from "../ai/useOpenAi.js";
import { isAllowed, isAdmin } from "./accessControl.js";
import { errorAlert, help, notAllowed, welcome, added, cancelled } from "./texts.js";
import handleError from "./handleError.js";
import generateImgUrl from "../ai/useDallE.js";

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

    //Start Command
    bot.start(async (ctx) => {
        try{
            const sendReply = await ctx.reply(welcome);
            saveMSG(ctx, welcome, sendReply.message_id, false);
        } catch (error) {
            handleError(error, ctx, errorAlert);
        }
    });

    //HELP Command
    bot.help(async (ctx) => {
        try {
            const sendReply = await ctx.reply(help);
            saveMSG(ctx, help, sendReply.message_id, false);
        } catch (error) {
            handleError(error, ctx, errorAlert);
        } 
    });

    //Admin Whitelists a user
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

    //Admin blocks a user
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
    
    //User resets old conversation
    bot.command(['new', 'reset'], async (ctx) => {
        try{
            const msgListToBeDeleted = await fetchAllMSGs(ctx);
            await deleteAllMSGs(ctx);
            const sendReply = await ctx.reply("Ya puedes empezar a hablar de otro tema. Si quieres, puedes tambien limpiar el chat.");
        } catch (error) {
            handleError(error, ctx, errorAlert);
        }
    });

    //Send MSG to AI
    bot.on('message', async (ctx) => {
        try {
            
            //Show Typing to user
            ctx.sendChatAction('typing');

            if(ctx.message.text.includes('-image')) {
                console.log("About to generate an image with DALL-E");
                const url = await generateImgUrl(ctx.message.text);
                console.log(url);
                return ctx.reply(url);
            }

            //Fetch previous AI answer for context and use it to create new answer
            const previousAnswers = await fetchAllMSGs(ctx);
            console.log("Previous msgs: ", previousAnswers);
            const aiReply = await generateReplay(ctx.message.text, previousAnswers);
            console.log("Text in TELEGRAM route: ", aiReply);
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
