import { Configuration, OpenAIApi } from "openai";
import { greet, noEntiendo } from "../telegram/texts.js";

const generateReplay = async (prompt, lastAnswer) => {
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
            organization: "org-JibDNApCUHGDIK54ohrrUWyE",
            apiKey: process.env.API_KEY_OPENAI
        });
    
        const openai = new OpenAIApi(configuration);

        const query = `${lastAnswer} ${prompt}`;

        const params = {
            model: "text-davinci-003",
            prompt: query,
            //prompt: prompt,
            max_tokens: 1000,
            temperature: 0.9,
            frequency_penalty: 0.5
        };

        const aiResponse = await openai.createCompletion(params);

        let text = aiResponse.data.choices[0].text;

        if(text.includes("leaves a message telling the user he does not know the answer")){
            text = 'No Entiendo. Puedes esplicarmelo mejor, por favor?';
        }

        return text;

    } catch (error) {
        console.log(error);
        return "AI Failed";
    }
    
}

export default generateReplay;