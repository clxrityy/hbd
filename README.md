# hbd <img src="/assets/avatar.gif" style="width:40px">

a discord birthday bot

#### ⚠️ in development

---

## configuration

- #### `/config`

##### set channels:

`/config channels`

- `announcement_channel`: the channel for birthdays to be announced in
- `command_channel`: the channel for commands
- **`reset`**: **reset the channel settings**

> by default they will both be the default channel

##### set roles:

`/config roles`

- `birthday_role`: the role users get on their birthday
  - make sure the bot's role position is higher, otherwise the bot will not have permission to manage this role.
- `admin_role`: the role that can configure birthday settings
- **`reset`**: **reset the role settings**

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
client.login(process.env.BOT_TOKEN!).then(() => client.emit("interval"));
```

- which returns an interval that runs once a day and checks for birthdays
  - if there's a birthday present, the `birthday` event is emitted with the designated user id

```ts
module.exports = (client: Client) => {
  const handleInterval = async (client: Client) => {
    let date = new Date();
    let filter = {};
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
  };

  return setInterval(
    async () => await handleInterval(client),
    1000 * 60 * 60 * 24
  ); // 1000 * 60 * 60 = 1 hr
};
```

#### [birthday event](./src/events/birthday/)

- fetches the channel to announce in and announces the birthday 
    - [🔗 `events/birthday/announce.ts`](./src/events/birthday/announce.ts)

```ts
//...
const announceChannelId = guildData.AnnouncementChannel!;

channel = await(
  await(await client.guilds.fetch(guildId)).channels.fetch(announceChannelId)
).fetch() as TextChannel;

return await channel.send(/* ... */);
```

- fetches the birthday role (if it exists) and gives it to the user
    - [🔗 `events/birthday/role.ts`](./src/events/birthday/role.ts)

```ts
let birthdayRole: Role;

targetGuild.roles.cache.forEach((role) => {
  if (role.id === guildData.BirthdayRole) {
    birthdayRole = role;
  }
  return;
});

try {
    return await user.roles.add(birthdayRole);
} catch (err) {
    //...
}
```

---

## TODO →

#### functionality

- [x] make it so commands only work in the command channel(s)
  - [ ] also so that there can be mulitple command channels
- [ ] add configuration for announcing multiple birthdays
- [x] add configuration for giving the _birthday_ role
  - [x] and removing once the day is over
- [ ] add the ability for guild admins to configure the _"happy birthday"_ message/embed
- [x] add the abiltiy for guild admins to change birthdays
  - [x] and/or change settings to allow people to change theirs
    - [ ] certain role can update their birthday(?)
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