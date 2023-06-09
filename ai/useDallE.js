import { Configuration, OpenAIApi } from "openai";

const generateImgUrl = async (prompt) => {

    try {
        const configuration = new Configuration({
            apiKey: process.env.API_KEY_OPENAI
        });
        const openai = new OpenAIApi(configuration);
        const res = openai.createImage({
            prompt: prompt.replace(/-image/, ''),
            n: 1,
            size: "512x512"
        });

        const url = (await res).data.data[0].url;
        
        return url;

    } catch (error) {
        console.log(error);
        return "AI Failed.\n Usar el comando /reset y luego intentar de nuevo";
    }
    
}

export default generateImgUrl;