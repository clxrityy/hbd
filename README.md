# hbd <img src="/assets/icon.png" style="width:40px">

a discord birthday bot

#### ⚠️ in development
---
## configuration

- #### `/config`

##### set channels:
`/config channels`
- `announcement_channel`: the channel for birthdays to be announced in
- `command_channel`: the channel for commands

> by default they will both be the default channel

##### set roles:
`/config roles`

- `birthday_role`: the role users get on their birthday
- `admin_role`: the role that can configure birthday settings

> by default both are nothing

---

## commands

- `/birthday set {month} {day}`
    - can only be set once
- `/birthday view {user}`
    - view an (optional) target user's birthday
    - with no user option specified, will show your own

---

## how it works

- guild & user data is stored in mongoose [models](https://mongoosejs.com/docs/models.html)
    - guild settings (channels, roles)
    - user's birthdays



- when the bot logs in, the [`interval`](./src/events/interval) event is emitted:

```ts
client.login(process.env.BOT_TOKEN!).then(() => client.emit("interval"))
```

- which returns an interval that runs once a day and checks for birthdays
    - if there's a birthday present, the `birthday` event is emitted with the designated user id

```ts
module.exports = (client: Client) => {

    const handleInterval = async (client: Client) => {
        let date = new Date();
        let filter = {}
        const birthdays = await Birthday.find(filter);

        const dateString = date.toLocaleDateString();
        const dateArray = dateString.split("/");
        const dateParsed = dateArray[0] + `/` + dateArray[1];

        for (const birthday of birthdays) {

            if (birthday.Birthday === dateParsed) {
                client.emit("birthday", birthday.UserID);
            } else {
                return;
            }
        }
    }

    return setInterval(async () => await handleInterval(client), 1000 * 60 * 60 * 24);
    // 1000 * 60 * 60 = 1 hr
}
```

- the birthday event fetches the channel to announce in and announces the birthday

```ts
//...
    const announceChannelId = guildData.AnnouncementChannel!;

    channel = await (await (await client.guilds.fetch(guildId)).channels.fetch(announceChannelId)).fetch() as TextChannel;

    return await channel.send(/* ... */);
```

---

## TODO →

#### functionality
- [ ] add configuration for multiple birthdays
- [ ] add configuration for giving the *birthday* role
    - and removing once the day is over
- [ ] add the ability for guild admins to configure the *"happy birthday"* message/embed
- [ ] add the abiltiy for guild admins to change birthdays
    - and/or change settings to allow people to change theirs
- [ ] add the ability to configure only a certain role(s) to be able to set their birthday
- [ ] add a command to list birthdays (all or by month/day)


#### misc (?)
- [ ] zodiac sign commands(?)
    - see what sign users are
    - horoscope
    - etc.
- [ ] wish users happy birthday
    - only available on a person's birthday
    - `/wish {user} {message}`
    - `/wishes` - can view any time
- [ ] option to have unique AI generated messages to wish people happy birthday
