const { Main } = require('./Main')
const { CATEGORIES } = require('../CONSTANTS')

class Category extends Main {
  folder = 'data/categories/'

  constructor(link) {
    super()
    this.categories = []
    this.requestUrl = link + CATEGORIES
    this.total = 0
  }

  async loadCategories() {
    this.checkFolder()

    const response = await this.makeRequest(this.requestUrl)
    // this.total = response.headers['x-wp-total']
    this.total = 300
    const pages = Math.ceil(this.total / 100)

    if (this.total <= 10) {
      this.transformData(response.data)
    } else if (this.total > 100) {
      const requests = []
      for (let index = 1; index <= pages; index++) {
        const options = this.encodeQueryData({
          per_page: 100,
          offset: 100 * (index - 1),
        })
        requests.push(`${this.requestUrl}${options}`)
      }

      requests.map((link) => () => this.makeRequest(link)).reduce( this.reducer, Promise.resolve() )
      console.log(requests)
    } else {
      const options = this.encodeQueryData({
        per_page: this.total,
      })
      const response = await this.makeRequest(`${this.requestUrl}${options}`)
      this.transformData(response.data)
    }

    this.saveData(
      'categories.json',
      this.folder,
      JSON.stringify(this.categories)
    )
  }

  checkFolder() {
    if (!this.folderExists(this.folder)) {
      this.createFolder(this.folder)
    } else {
      this.deleteFolder(this.folder)
      this.createFolder(this.folder)
    }
  }

  transformData(data) {
    this.categories = data.map((element) => {
      const newElement = {}
      newElement.name = element.name
      newElement.slug = element.slug
      newElement.parent = element.parent
      newElement.description = element.description
      return newElement
    })
  }
}

module.exports = { Category }
