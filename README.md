# konachan-popular-bot-node

**This is a Work In Progress**

This repository contains the source code of an alternative backend program that works similarly to the bot running the Telegram channel [@KonachanPopular](https://t.me/KonachanPopular).

By leveraging Node.js's `Stream` feature, it is able to upload image of bigger sizes (up to 10MB), thus having better quality than the bot in @KonachanPopular.

## Run in a Container

**WIP**

## Run from Source

First, you need to make sure you have Node.js `>=18` installed. Then, enable corepack (usually it is bundled with Node.js):
```sh
corepack enable
```

Then, clone the repository and run the program:
```sh
git clone https://github.com/sekiryu-tierxi/konachan-popular-node.git --depth 1
cd konachan-popular-node
yarn start -c [CHAT_ID] -t [TOKEN] -b [moebooru_INSTANCE]
```

`moebooru_INSTANCE` is the base URL of an moebooru-based site. Defaults to `https://konachan.com`.
