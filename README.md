# ai-discord-bot template

### 🔗 [Invite](https://discord.com/api/oauth2/authorize?client_id=1207469340149026837&permissions=2147483648&scope=bot)

### 📖 [Read the guide](https://dev.to/clxrityy/how-to-create-a-dynamic-ai-discord-bot-with-typescript-3gjn)

---

## configuration

#### [`config.ts`](/src/config.ts)

```ts
/*
    Your default AI settings
*/
    openai: {
        model: /** 
            https://platform.openai.com/docs/models
        */ ,
        systemRoleContent: /**
            https://platform.openai.com/docs/guides/text-generation/chat-completions-api
        */,
        temperature: /**
            https://platform.openai.com/docs/guides/text-generation/how-should-i-set-the-temperature-parameter
        */,
        presence_penalty: /** 
            https://platform.openai.com/docs/guides/text-generation/parameter-details
        */,
    }
```

#### [`.env`](/.env.example)
```env
# DISCORD
BOT_TOKEN=

# OPENAI
OPENAI_API_KEY=
OPENAI_ORGANIZATION_ID=

# MONOGDB
MONGO_URI=
```

---

## commands

- `/ai` **`[prompt]`**
- `/settings`
    - `config`
        -  [model](https://platform.openai.com/docs/models)
        -  [precense_penalty](https://platform.openai.com/docs/guides/text-generation/parameter-details)
        -  [role](https://platform.openai.com/docs/guides/text-generation/chat-completions-api)
        -  [temperature](https://platform.openai.com/docs/guides/text-generation/how-should-i-set-the-temperature-parameter)
    - `view`
    - `reset`
    - `help`

---

## deployment

- create and connect to an [AWS instance](https://ca-central-1.console.aws.amazon.com/ec2/home?c=ec2&p=pm&region=ca-central-1&z=1#Home:)

#### environment set up

```ubuntu
sudo apt update
```

- install node & npm 

```ubuntu
sudo apt install nodejs
```
```
sudo apt install npm
```

- set to the latest node version

```
sudo n 21.6.2
```

- check for the latest node version

```ubuntu
node --version
```

- if you're stealing an earlier version, run

```ubuntu
hash -r
```

#### bot set up

- make a directory for the bot

```ubuntu
mkdir bot
```
```ubuntu
cd bot
```

- clone the repo into the bot folder

```ubuntu
git clone https://github.com/clxrityy/ai-discord-bot.git .
```

- input your environment variables

```ubuntu
cat > .env >> # your variables
```

#### deploy

- install `pm2`

```ubuntu
sudo npm i pm2 -g
```

- build and then deploy from `/dist`

```ubuntu
npm run build
```
```ubuntu
pm2 start ./dist/index.js --name bot-name
```