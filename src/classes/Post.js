const { Main } = require('./Main')

const { POSTS } = require('../CONSTANTS')

class Post extends Main {
  constructor(link) {
    super(link)
    this.posts = []
    this.requestUrl = link + POSTS
    this.folder = `data/${this.folderName}/posts/`
  }

  async loadPosts() {
    const data =
      (await this.loadData(
        this.folder,
        this.requestUrl,
        this.operateMoreData
      )) || this.posts

    if (!data) return

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
      return newElement
    })
  }

  async markdownData() {
    const mdFolder = `${this.folder}/md/`
    this.checkFolder(mdFolder)

    this.posts.forEach((element) => {
      const fileName = `${element.slug}.md`
      let md = '--- \n'
      md += `id: '${element.id}' \n`
      md += `title: '${element.name}' \n`
      md += `description: '${element.description}' \n`
      md += `slug: ${element.slug} \n`
      md += `date: ${element.date} \n`
      md += `link: ${element.link} \n`
      md += `categories: [${element.categories.join(' ,')}] \n`
      md += `--- \n`
      this.operateMarkdown(md, element.content, fileName, mdFolder)
    })
  }
}

module.exports = { Post }
