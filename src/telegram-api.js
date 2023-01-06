import TelegramBot from 'node-telegram-bot-api'
import got from 'got'
import { MoebooruInstance } from './moebooru-api.js'

function splitArray(arr, by) {
	const res = new Array(Math.ceil(arr.length / 10)).map(() => new Array())
	for (let i = 0; i < arr.length; i++) {
		res[Math.floor(i / 10)].push(arr[i])
	}
	return res
}

export class Telegram {
	constructor(apiToken, chatId, baseUrl) {
		this.bot = new TelegramBot(apiToken)
    this.chatId = chatId
		this.moebooru = new MoebooruInstance(baseUrl)
	}
	batchUploadImage(chatId, urls) {
		const splitUrls = splitArray(urls, 10)
		const mediaGroups = splitUrls.map((urls) =>
			urls.map((url) => ({
				type: 'photo',
				media: got.stream(url),
			})),
		)
		return this.bot.sendMediaGroup(chatId, mediaGroups)
	}
	async run() {
		const rawImageObjects = await this.moebooru.getPopularImageList()
		const imageObjects = MoebooruInstance.filterImageUrl(rawImageObjects).map(
			(x) => x.url,
		)
		return this.batchUploadImage(this.chatId, imageObjects)
	}
}
