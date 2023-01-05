import got, { Options } from 'got'

function filterSingleImageUrl(image) {
	const MEGABYTE_CONSTANT = 1024 * 1024
	if (image.file_size / MEGABYTE_CONSTANT < 10) return image.file_url
	if (image.jpeg_file_size / MEGABYTE_CONSTANT < 10) return image.jpeg_url
	return image.sample_url
}

export class MoebooruInstance {
	constructor(baseUrl) {
		this.gotOptions = new Options({
			prefixUrl: baseUrl,
		})
		this.gotOptions.freeze()
	}
	getImageList(limit = 20) {
		return got('post.json', { searchParams: { limit } }, this.gotOptions).json()
	}
	getPopularImageList() {
		return got('post/popular_recent.json', undefined, this.gotOptions).json()
	}
	static filterImageUrl(imageList) {
		return imageList.map((image) => ({
			score: image.score,
			url: filterSingleImageUrl(image),
		}))
	}
	static sortImageList(imageList) {
		return imageList.sort((a, b) => b.score - a.score)
	}
}
