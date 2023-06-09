# CUBAGPT #

This is the source code of the [CubaGPT Telegram BOT](https://t.me/Chat_GPT_Cuban_Bot), which allows people to interact with a ChatGPT through a Telegram bot.

This project uses the gpt-3.5-turbo model of OpenAI under the hood.

The user sends prompts to ChatGPT in the form of text messages sent to the Telegram BOT. In turn, the Telegram BOT gets the user's input and passes it to ChatGPT API in the background. When the AI sends back a reply, this is forwarded back to the user.

In order to improve the quality of AI responses, some prompt manipulation is performed on users' messages. All the messages that make up a certain conversation, are stored in MongoDB, so that they can be retrived as needed to provide the AI with the context of the conversation.

By using the bot commands `/reset` or `/new`, the user can cancel the conversation, so that the old context doesn't mess up a new conversation on a different topic.

You can also generate images using DALL-E. In order to do that is sufficient to send to the bot a message that contains the description of the image, preceded by `--image`. 

The Bot's Admin can also regulate access to the Bot. Access can be open to everyone, or can be regulated through a whitelist of Telegram aliases (which is store in MongoDB). This functionality is regulated by the `ISFREEACCESS` property in the `.env` file.

The admin can add and remove users in whitelist throught Telegram Bot itself. 

Using the command `/user ` followed by the Telegram alias that needs to be whitelisted, the admin can whitelist a new user.  

Using the command `/delete ` followed by the Telegram alias that needs to be taken out of from the whitelist, the admin can remove a user from the whitelist.

## GETTING STARTED: ##

**FIRST** of all, run `npm i` to install all dependencies.

**THEN**, create a `.env` file in the root of the project, where you will store the following variables.

```
ADMIN=joeblogs //The Telegram alias of the bot Admin
ISFREEACCESS=true //Everybody can use the bot
API_KEY_OPENAI=my_OPENAI_API_key
TELEGRAF_API=my_Telegram_API_key
CONNECTION=my_connection_string_to_MongoDB
```

## DISCLAIMERS: ## 

AI language models create credible answers, but these answers are not necessarily correct all the time. In fact, the Bot's answers can be biased, misleading or plain wrong.


