# hbd <img src="/assets/avatar.gif" style="width:40px">

a discord bot for user's birthdays, horoscopes, and wishing user's a happy birthday.


- ### 🔗 [INVITE](https://discord.com/oauth2/authorize?client_id=1211045842362966077&permissions=2415921152&scope=bot)
- ### 🌐 [DISCORD SERVER](https://discord.gg/n65AVpTFNf)

- ### 📋 [CHANGELOG](/CHANGELOG.md)

#### 📖 [WIKI](https://github.com/clxrityy/hbd/wiki)
- [Getting Started](https://github.com/clxrityy/hbd/wiki/Getting-Started) — Information about configuring the bot for your guild

<img src="/assets/banner-rounded.gif" alt="banner" style="height:150px;width:375px;border-radius:30px" />

---

# how it works

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
    - 🔗 [`events/birthday/announce.ts`](./src/events/birthday/announce.ts)

```ts
//...
const announceChannelId = guildData.AnnouncementChannel!;

channel = await(
  await(await client.guilds.fetch(guildId)).channels.fetch(announceChannelId)
).fetch() as TextChannel;

return await channel.send(/* ... */);
```

- fetches the birthday role (if it exists) and gives it to the user
    - 🔗 [`events/birthday/role.ts`](./src/events/birthday/role.ts)

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