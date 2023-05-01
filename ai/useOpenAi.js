import { Configuration, OpenAIApi } from "openai";
import { greet, noEntiendo } from "../telegram/texts.js";

const compileMessages = (query, chatHistory) => {
    const sysMSG = {
        role: "system", 
        content: "You are a helpful assistant. Your objective is to reply to the user's questions."
    };

    let messages = [ sysMSG ];

    chatHistory.forEach(chat => {
        if(
            !chat.msg.includes('/new') || 
            !chat.msg.includes('/reset') || 
            !chat.msg.includes('/start') ||
            !chat.msg.includes('/help') ||
            !chat.msg.includes('/user') ||
            !chat.msg.includes('/delete')
        ) {
            const chatObj = {
                role: chat.isAIgenerated == true ? "assistant" : "user",
                content: chat.msg
            }
            messages.push(chatObj);
        }
        
    })

    messages.push({
        role: "user", 
        content: query
    });

    return messages;
}

const generateReplay = async (prompt, lastAnswers) => {
    try {

        //Greet without bothering the AI
        if(
            prompt.toLowerCase() == 'hola' || 
            prompt.toLowerCase() == 'hola!' ||
            prompt.toLowerCase() == 'hi!' ||
            prompt.toLowerCase() == 'hi'
        ){
            return greet;
        }

        if(prompt.length < 3) return noEntiendo;
        
        //const spanishPrompt = `${prompt}. Contestar en español`;
        const configuration = new Configuration({
            apiKey: process.env.API_KEY_OPENAI
        });
    
        const openai = new OpenAIApi(configuration);

        let completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: compileMessages(prompt, lastAnswers)
        });

        console.log("MSG to be sent to user: ", )
        console.log(completion.data.choices[0].message.content);

        let text = completion.data.choices[0].message.content;
        
        if(text.includes("leaves a message telling the user he does not know the answer")){
            text = 'No Entiendo. Puedes esplicarmelo mejor, por favor?';
        }
        console.log("TEXT in Generate Reply: ", text)
        return text;

    } catch (error) {
        console.log(error);
        return "AI Failed";
    }
    
}

export default generateReplay;