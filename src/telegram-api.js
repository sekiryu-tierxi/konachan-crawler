import TelegramBot from 'node-telegram-bot-api'
import { sleep } from './util.js'
import { MoebooruInstance } from './moebooru-api.js'

function createGroups(arr, size) {
	const res = []
	for (let i = 0; i < arr.length; i++) {
		if (i % size === 0) {
			res.push([arr[i]])
		} else {
			res[res.length - 1].push(arr[i])
		}
	}
	return res
}

export class Telegram {
	constructor(apiToken, chatId, baseUrl) {
		this.bot = new TelegramBot(apiToken)
		this.chatId = chatId
		this.moebooru = new MoebooruInstance(baseUrl)
	}
	async batchUploadImage(chatId, rawUrls) {
		const splitUrls = createGroups(rawUrls, 10)
		const mediaGroups = splitUrls.map((urls) =>
			urls.map((url) => ({
				type: 'photo',
				media: url,
			})),
		)
		mediaGroups.forEach(async (mediaGroup, idx) => {
			await this.bot.sendMediaGroup(chatId, mediaGroup)
      sleep(1000)
		})
	}
	async run() {
		const rawImageObjects = await this.moebooru.getPopularImageList()
		const imageObjects = MoebooruInstance.filterImageUrl(rawImageObjects).map(
			(x) => x.url,
		)
		return this.batchUploadImage(this.chatId, imageObjects)
	}
}
