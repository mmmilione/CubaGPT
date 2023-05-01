import { Messages, Users } from "./models.js";

const saveMSG = async (ctx, msg, id, isAIgenerated) => {

    try {
        
        const newMSG = {
            userID: ctx.message.from.id,
            msgID: id,
            msg: msg,
            isAIgenerated: isAIgenerated,
            time: new Date().getTime()
        }

        await Messages(newMSG).save();

        return true;

    } catch (error) {
        console.log(error);
    }
}

const fetchAllMSGs = async (ctx) => {
    try {
        const query = { userID: ctx.message.from.id };
        const allMessages = await Messages.find(query);
        return allMessages;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const deleteAllMSGs = async (ctx) => {
    try {
        const query = { userID: ctx.message.from.id };
        await Messages.deleteMany(query);
        return true;
    } catch (error) {
        console.log(error);
    }
}

const addUser = async (username) => {

    try {
        const query = {alias: username};
        const user = await Users.findOne(query);
        if(user) return user;
        const newUser = {
            alias: username,
            credits: 1000,
        }

        const addedUser = await Users(newUser).save();
        return addedUser;

    } catch (error) {
        console.log(error);
        throw Error('No Se Pudo Agregar el Usuario');
    }
}

const deleteUser = async (username) => {
    try{
        const query = {alias: username};
        await Users.findOneAndDelete(query);
        return true;
    } catch (error) {
        console.log(error);
        throw Error('No Se Pudo Agregar el Usuario');
    }
}

export { saveMSG, deleteAllMSGs, fetchAllMSGs, addUser, deleteUser };