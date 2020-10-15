const { Main } = require('./Main')

const { MEDIA } = require('../CONSTANTS')

class Media extends Main {
  constructor(link) {
    super(link)
    this.media = []
    this.requestUrl = link + MEDIA
    this.folder = `data/${this.folderName}/files/`
  }

  async loadMedia() {
    const data =
      (await this.loadData(
        this.folder,
        this.requestUrl,
        this.operateMoreData
      )) || this.media

    if (!data) return

    await data
      .map((element) => [element.source_url, element.mime_type, element.slug])
      .map(([link, type, name]) => async () =>
        await this.saveFile(link, type, name, this.folder)
      )
      .reduce(this.reducer, Promise.resolve())
  }

  async operateMoreData(link, that) {
    const response = await that.makeRequest(link)
    that.media = [...that.media, ...response.data]
  }
}

module.exports = { Media }
