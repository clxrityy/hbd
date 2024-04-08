# hbd

## v1.2.0

### Major Changes

- created a separate event to make sure the interval event is only emitted at midnight every day

  the **time** event, emitted on login:

  ```ts
  // index.ts
  client.login(token).then(() => client.emit("time"));
  ```

  ```ts
  // src/events/time/interval.ts

  module.exports = (client: Client) => {
    const interval = (hours: number) =>
      setInterval(() => {
        const date = new Date();
        const currentHour = date.getHours();

        if (currentHour === hours) {
          client.emit("interval");
        }
      }, 60 * 60 * 1000); // Check every hour

    return interval(0); // Start the interval at 12 AM
  };
  ```

- c7f7469: the first release of the bot

### Patch Changes

- update packages to latest
