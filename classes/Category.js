const { Main } = require('./Main')
const { CATEGORIES } = require('../CONSTANTS')

class Category extends Main {
  folder = 'data/categories/'

  constructor(link) {
    super(link)
    this.categories = []
    this.requestUrl = link + CATEGORIES
    this.total = 0
  }

  async loadCategories() {
    this.checkFolder(this.folder)

    const response = await this.makeRequest(this.requestUrl)

    this.total = response.headers['x-wp-total']
    const pages = Math.ceil(this.total / 100)

    // if there are categories count smaller or equals ten - transforming and saving data
    if (this.total <= 10) {
      this.transformData(response.data)

      // if more
    } else if (this.total > 100) {

      // making request array
      const requests = []
      for (let index = 1; index <= pages; index++) {
        const options = this.encodeQueryData({
          per_page: 100,
          offset: 100 * (index - 1),
        })
        requests.push(`${this.requestUrl}${options}`)
      }

      const that = this
      // executing requests array one after each other
      await requests
        .map((link) => async() => await this.operateMoreData(link, that))
        .reduce(this.reducer, Promise.resolve())

      // transforming and saving data
      this.transformData(this.categories)

      // else adding total categories count as per_page
    } else {
      const options = this.encodeQueryData({
        per_page: this.total,
      })
      const response = await this.makeRequest(`${this.requestUrl}${options}`)
      this.transformData(response.data)
    }

    // saving data
    this.saveData(
      'categories.json',
      this.folder,
      JSON.stringify(this.categories)
    )
  }

  async operateMoreData(link, that) {
    await new Promise(async (resolve, reject) => {
      const response = await this.makeRequest(link)
      that.categories = [...response.data]
      resolve()
    })
  }

  // getting correct object properties
  transformData(data) {
    this.categories = data.map((element) => {
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
