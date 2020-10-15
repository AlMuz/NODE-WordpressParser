const { Main } = require('./Main')

const { PAGES } = require('../CONSTANTS')

class Page extends Main {
  constructor(link) {
    super(link)
    this.pages = []
    this.requestUrl = link + PAGES
    this.folder = `data/${this.folderName}/pages/`
  }

  async loadPages() {
    const data =
      (await this.loadData(
        this.folder,
        this.requestUrl,
        this.operateMoreData
      )) || this.pages

    if (!data) return

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
      return newElement
    })
  }

  async markdownData() {
    const mdFolder = `${this.folder}/md/`
    this.checkFolder(mdFolder)

    this.pages.forEach((element) => {
      const fileName = `${element.slug}.md`
      let md = '--- \n'
      md += `title: '${element.name}' \n`
      md += `description: '${element.description}' \n`
      md += `date: ${element.date} \n`
      md += `slug: ${element.slug} \n`
      md += `--- \n`
      this.operateMarkdown(md, element.content, fileName, mdFolder)
    })
  }
}

module.exports = { Page }
