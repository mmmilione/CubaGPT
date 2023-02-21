# CUBAGPT #

This is the source code of the [CubaGPT Telegram BOT](https://t.me/Chat_GPT_Cuban_Bot), which allows people to interact with a ChatGPT-like AI model through a Telegram bot.

The user sends prompts to ChatGPT in the form of text messages sent to the Telegram BOT. In turn, the Telegram BOT gets the user's input and passes it to ChatGPT in the background.

In fact, the prompt is not passed as it is. In order to improve the quality of AI responses, some prompt manipulation is performed on users' messages, to add relevant context to it. 

This result is achieved by storing messages in MongoDB, which are used to perform some minor prompt engeneering. The last reply of the AI in the conversation at hand is fetched by the server and added to the user's message before quering the AI model. 

By using the bot command `/reset`, the user can cancel the conversation, so that the old context doesn't mess up the new conversation on a different topic.

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

The API of ChatGPT is not open to the public. This project uses the DaVinci003 model of OpenAI and adds context to users' prompts to achieve similar results.

AI language models create credible answers, but these answers are not necessarily always correct. In fact, the Bot's answers can be biased, misleading or plain wrong.


