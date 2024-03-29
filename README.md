# hbd <img src="/assets/avatar.gif" style="width:40px">

a discord birthday bot

[🔗 invite](https://discord.com/oauth2/authorize?client_id=1211045842362966077&permissions=2415921152&scope=bot)

---

# `ℹ️` how it works

- data is stored in mongoose [models](https://mongoosejs.com/docs/models.html)

  - guild settings (channels, roles)
  - user's birthdays
  - birthday wishes

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

### [birthday event](./src/events/birthday/)

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

# `/` commands

- [birthday](#birthday)
  - [hbd](#hbd-1)
  - [horoscope](#horoscope)
- [admin](#admin)
  - [edit](#edit)
  - [config](#config)
    - [view](#config-view)
    - [channels](#channels)
    - [roles](#roles)
    - [messages](#messages)
    - [general](#general)

## birthday <img src="/assets/icon.png" style="width:25px">

- `/birthday set {month} {day}`
  - can only be set once
- `/birthday view {user}`
  - view an (optional) target user's birthday
  - shows your own by default

#### `/hbd`

- `/hbd wish {user} {birthday_message}`
  - wish a user a happy birthday
  - *birthday message optional*
- `/hbd view {target} {year}`
  - view birthday wishes
  - *target **user** & **year** are optional*


## admin <img src="/assets/admin.png" style="width:25px">
- by default, only accessible to users with **Administrator** permissions
  - otherwise, also accessible to users with the established [admin role](#roles)

#### `/edit`

- `/edit {user} {month} {day}`
- change a user's birthday

### config 

#### `/config view`

- view your guild's configurations

#### channels:

##### `/config channels`

- `announcement_channel`— the channel for birthdays to be announced in
- `command_channel` — the channel for commands
- **`reset`** — **reset the channel settings**

> by default they will both be the default channel

#### roles:

##### `/config roles`

- `birthday_role` — the role users get on their birthday
  - make sure the bot's role position is higher, otherwise the bot will not have permission to manage this role.
- `admin_role` — the role that can configure birthday settings
- **`reset`** — **reset the role settings**

> by default both are nothing

#### messages:

##### `/config messages`

- `announcement` — the message that announces user's birthdays
  - use `{{user}}` to indicate the user mention

#### general

##### `/config general`
- `changeable` — whether or not user's can edit their own birthdays
  - **true** or **false**
  - by default only admins can edit birthdays

---

# `→` TODO

#### functionality

- [x] make it so commands only work in the command channel(s)
  - [x] also so that there can be mulitple command channels
- [x] add configuration for giving the _birthday_ role
  - [x] and removing once the day is over
- [x] add the ability for guild admins to configure the _"happy birthday"_ message/embed
- [x] add the abiltiy for guild admins to change birthdays
  - [x] and/or change settings to allow people to change theirs
    - [ ] certain role can update their birthday(?)
- [ ] add the ability to configure only a certain role(s) to be able to set their birthday
- [x] add a command to list birthdays (all or by month/day)


#### misc (?)

- [ ] zodiac sign commands(?)
  - [x] see what sign users are
  - horoscope
  - etc.
- [x] wish users happy birthday
  - only available on a person's birthday
  - `/wish {user} {message}`
  - `/wishes` - can view any time
- [ ] option to have unique AI generated messages to wish people happy birthday
- [ ] option to change the guild name upon someone's birthday (kudos to good vibes)
- [ ] add some sort of `/whitelist` optional command to whitelist users from certain commands