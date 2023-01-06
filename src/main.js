import cac from 'cac'
import { Telegram } from './telegram-api.js'

const cli = cac('konachan-bot')

cli.option('-b, --base-url <baseUrl>', 'Set the moebooru instance URL', {
	default: 'https://konachan.com',
})

cli.option('-c, --chat-id <chatId>', 'Target chat/channel id')

cli.option('-t, --token <botToken>', 'Telegram bot token')

cli.option('-r, --retry-limit <limit>', 'Maximum retries before bailing out', {
  default: 5
})

cli.option('-i, --retry-interval <interval>', 'Interval between retries in miliseconds', {
  default: 5000
})

cli.help()

const { options } = cli.parse()

if (options.h) process.exit(0)

if (!(options?.token && options?.chatId)) {
  console.error('Please provide bot token and target chat id!')
  process.exit(1)
}

const bot = new Telegram(options.token, options.chatId, options.baseUrl)

let retry = 0

while(retry <= options.retryLimit) {
  try {
    await bot.run()
    process.exit(0)
  } catch (e) {
    console.error(e.code + '\n')
    console.error(e.response.body)
    retry++
    const current = Date.now()
    while(Date.now() - current <= options.retryInterval) {}
  }
}

console.error('Maximum retry limit reached, bailing out!')
process.exit(1)
