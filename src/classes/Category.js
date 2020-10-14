const { Main } = require('./Main')
const { CATEGORIES } = require('../CONSTANTS')

class Category extends Main {
  folder = 'data/categories/'

  constructor(link) {
    super(link)
    this.categories = []
    this.requestUrl = link + CATEGORIES
  }

  async loadCategories() {
    const data =
      (await this.loadData(
        this.folder,
        this.requestUrl,
        this.operateMoreData
      )) || this.categories

    if (!data) return

    this.categories = this.transformData(data)

    // saving data
    this.saveData(
      'categories.json',
      this.folder,
      JSON.stringify(this.categories)
    )
  }

  async operateMoreData(link, that) {
    const response = await that.makeRequest(link)
    that.categories = [...that.categories, ...response.data]
  }

  // getting correct object properties
  transformData(data) {
    return data.map((element) => {
      const newElement = {}
      newElement.id = element.id
      newElement.name = element.name
      newElement.slug = element.slug
      newElement.parent = element.parent
      newElement.description = element.description
      return newElement
    })
  }
}

module.exports = { Category }
