const { Main } = require('./Main')

const { PAGES } = require('../CONSTANTS')

class Page extends Main {
  folder = 'data/pages/'

  constructor(link) {
    super()
    this.pages = []
    this.requestUrl = link + PAGES
  }

  async loadPages() {
    const data =
      (await this.loadData(
        this.folder,
        this.requestUrl,
        this.operateMoreData
      )) || this.pages

    this.pages = this.transformData(data)

    // saving data
    this.saveData('pages.json', this.folder, JSON.stringify(this.pages))
  }

  async operateMoreData(link, that) {
    const response = await that.makeRequest(link)
    that.pages = [...that.pages, ...response.data]
  }

  // getting correct object properties
  transformData(data) {
    return data.map((element) => {
      const newElement = {}
      newElement.id = element.id
      newElement.date = element.date
      newElement.content = element.content.rendered
      newElement.description = element.excerpt.rendered
      newElement.name = element.title.rendered
      newElement.slug = element.slug
      newElement.link = element.link
      newElement.parent = element.parent
      newElement.template = element.template
      newElement.attachments = element['wp:attachment']
      return newElement
    })
  }
}

module.exports = { Page }
