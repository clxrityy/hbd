# hbd <img src="/assets/avatar.gif" style="width:40px">

a discord bot for user's birthdays, horoscopes, and wishing user's a happy birthday.


- ### 🔗 [INVITE](https://discord.com/oauth2/authorize?client_id=1211045842362966077&permissions=2415921152&scope=bot)
- ### 🌐 [DISCORD SERVER](https://discord.gg/n65AVpTFNf)

- ### 📋 [CHANGELOG](/CHANGELOG.md)

#### 📖 [WIKI](https://github.com/clxrityy/hbd/wiki)
- [Getting Started](https://github.com/clxrityy/hbd/wiki/Getting-Started) — Information about configuring the bot for your guild

<img src="/assets/banner-rounded.gif" alt="banner" style="height:150px;width:375px;border-radius:24px" />

---

# bot structure

- the **client** is defined and logged in through the main (`/src/index.ts`) file.
  - the client is passed into the `eventHandler()` function

## `eventHandler()`

- the event handler seeks through the `/events` folder, where every event has its folder. within each event, all of the files are executed

```
├── events
│   ├── ready
│   │   ├── dbConnect.ts
│   │   ├── registerCommands.ts
│   │   ├── ...
├── ...
```

> for a more in-depth guide on how the structure of the bot is set up, you can read this guide: https://dev.to/clxrityy/how-to-create-a-dynamic-ai-discord-bot-with-typescript-3gjn

---

# OAUTH2 / API

functionality for authenticated users to access endpoints to retrieve bot data (such as birthdays, wishes, etc.) is **yet to be implemented**. however, OAuth2 is fully functional through the use of API routes with [express](https://expressjs.com/).

## routes

- ##### `/api/auth/discord/redirect`
  - retrieves the `access_token` & `refresh_token`, encrypts them, and serializes the session.
- ##### `/api/auth/user/profile`
  - returns the user object (if authorized)
- #### `/api/auth/revoke`
  - makes a post request to the discord API to revoke the access token (returns a `200` status if successful)

---

# configuration

## `.env`

```env
# DISCORD
BOT_TOKEN=
CLIENT_ID=
CLIENT_SECRET=
PUBLIC_KEY=

# OPENAI
OPENAI_API_KEY=
OPENAI_ORGANIZATION_ID=

# MONGODB / MONGOOSE
MONGO_URI=

# GITHUB
GITHUB_TOKEN=

# ENVIRONMENT
NODE_ENV=

# API
PORT=
SESSION_SECRET=
ENCRYPTION_KEY=
```

- retrieve **discord** environment variables
  - https://discord.com/developers/applications
- retrieve **openai** environment variables
  - https://platform.openai.com/api-keys
- retrieve **mongodb** environment variables
  - https://cloud.mongodb.com/
- retrieve **github** environment variable
  - https://github.com/settings/tokens
- your node environment should by default be set to `development`
  - the `run:deploy` command automatically exports this to be production
- your API environment variables can be set to anything you want, I recommend setting the port to `3001`
  - (do not change your session secret or encryption key after setting it)

## `config.ts`

```ts
import client from ".."; // import your client defined in /src/index.ts

const config = {
  client: client, // set this to your client
  colors: {
    error: "", // the color of error embeds
    warning: "", // the color of warning embeds
    success: "", // the color of success embeds
    primary: "" // primary color
  },
  messages: {
    // the default birthday announcement (can be changed/configured by each guild)
    happyBirthdayAnouncement: {
      title: "", // embed title
      color: "", // embed color
      footer: {
        text: "", // footer text
        iconURL: "", // footer image
      }
    },
    happyBirthdayMessage: "", // the default `/hbd wish` message (can be customized with the command)
    commands: {
      adminCommands: [], // title of commands only usable by admins
      devCommands: [] // title of commands to only be used by bot developers
    },
    developerIds: [], // user id's of the developers
    options: {
      startYear: 2024, // the year you started the bot (to ensure no birthday wishes are registered to previous years)
    },
    openai: {
      model: "", // the model for the AI to use. read more: https://platform.openai.com/docs/models (`gpt-3.5-turbo` recommended)
      systemRoleContent: "", // the directions on how the AI should operate
      temperature: 0.35, // values from 0 - 2, read more: https://platform.openai.com/docs/guides/text-generation/faq
      presence_penalty: 1, // read more: https://platform.openai.com/docs/guides/text-generation/frequency-and-presence-penalties
  },
  api: {
    endpoint: "https://discord.com/api/v10", // base discord API endpoint
    redirect_uri: "http://localhost:3001/api/auth/discord/redirect", // should be the same uri specified in your developer application settings
  }
}
```

---

