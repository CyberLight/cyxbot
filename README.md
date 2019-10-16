# Cyxbot
* It's a actual fetcher for telegram channel https://t.me/bug_bounty_channel
* This app can fetch `hactivities` from `HackerOne`

## Local Development (`Docker` + `git` + `VSCode` + `Remote Development` extension)
* After you clone and open project using `Open in Contiainer` command
* Your docker will be created with node.js env
* Now you can test behaviour and abilities of this app

## Env variables
* `TELEGRAM_BBBOT_BASE_URL` - it's a url for periodically ping web app, for example: `https://YOUR_APP_NAME.herokuapp.com/` for local development it's a `http://localhost:5000` url.
* `TELEGRAM_BBBOT_CHANNEL` - it's a name of your channel in telegram, for example `@name_of_channel` (your bot must have access to this channel).
* `TELEGRAM_BBBOT_TOKEN` - it's a token for telegram bot.
* `TELEGRAM_BBBOT_HACKERONE_GRAPHQL` - it's a `GraphQL` endpoint of `HackerOne`, for example `https://hackerone.com/graphql`.
* `TELEGRAM_BBBOT_FIREBASE_DB_URL` - it's a Firebase URL for storing last timestamp of `disclosed_at`, for example `https://YOUR_PROJECT_NAME.firebaseio.com`.
* `TELEGRAM_BBBOT_FIREBASE_SECRET` - secret access token for query and update database content.
* `TELEGRAM_BBBOT_LOOP_INTERVAL_IN_SECONDS` - it's an interval for preiodically querying `GraphQL` api in seconds, for  example `60` seconds, which equals to `1` minute.

## How to run app locally
* You need to fill in all the `ENV` variables above.
* Execute command `npm start`.

## Heroku ready
* This bot can be easily deployed to `heroku.com` [Heroku get started](docs/heroku_get_started.md)