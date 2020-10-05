const { Main } = require('./Main')

const { POSTS } = require('../CONSTANTS')

class Post extends Main {
  folder = 'data/posts/'

  constructor(link) {
    super()
    this.posts = []
    this.requestUrl = link + POSTS
  }

  async loadPosts() {
    const data =
      (await this.loadData(
        this.folder,
        this.requestUrl,
        this.operateMoreData
      )) || this.posts

    this.posts = this.transformData(data)

    // saving data
    this.saveData('posts.json', this.folder, JSON.stringify(this.posts))
  }

  async operateMoreData(link, that) {
    const response = await that.makeRequest(link)
    that.posts = [...that.posts, ...response.data]
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
      newElement.categories = element.categories
      newElement.template = element.template
      newElement.attachments = element['wp:attachment']
      return newElement
    })
  }
}

module.exports = { Post }
