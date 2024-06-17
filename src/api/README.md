# OAUTH2 / API

functionality for authenticated users to access endpoints to retrieve bot data (such as birthdays, wishes, etc.) is **yet to be implemented**. however, OAuth2 is fully functional through the use of API routes with [express](https://expressjs.com/).

## routes

- ##### `/api/auth/discord/redirect`
  - retrieves the `access_token` & `refresh_token`, encrypts them, and serializes the session.
- ##### `/api/auth/user/profile`
  - returns the user object (if authorized)
- #### `/api/auth/revoke`
  - makes a post request to the discord API to revoke the access token (returns a `200` status if successful)