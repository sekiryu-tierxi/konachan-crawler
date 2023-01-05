import got, { Options } from 'got'

function filterSingleImageUrl(image) {
	const MEGABYTE_CONSTANT = 1024 * 1024
	if (image.fileSize / MEGABYTE_CONSTANT < 10) return image.fileUrl
	if (image.jpegSize / MEGABYTE_CONSTANT < 10) return image.jpegUrl
	return image.sampleUrl
}

export const MoebooruInstance = function (baseUrl) {
	this.gotOptions = new Options({
		prefixUrl: baseUrl,
	})
	this.gotOptions.freeze()
}

MoebooruInstance.prototype.getImageList = function (limit) {
	return got('post.json', { searchParams: { limit } }, this.gotOptions).json()
}

MoebooruInstance.prototype.compressImageList = function (imageList) {
	return imageList.map((image) => ({
		score: image.score,
		jpegSize: image.jpeg_file_size,
		jpegUrl: image.jpeg_url,
		sampleSize: image.sample_file_size,
		sampleUrl: image.sample_url,
		fileSize: image.file_size,
		fileUrl: image.file_url,
	}))
}

MoebooruInstance.prototype.filterImageUrl = function (imageList) {
	return imageList.map((image) => ({
		score: image.score,
		url: filterSingleImageUrl(image),
	}))
}

MoebooruInstance.prototype.sortImageList = function (imageList) {
	return imageList.sort((a, b) => b.score - a.score)
}
