const { Category, Page, Post } = require('./classes/index')
const link = 'https://creditprime.md/'

;(async () => {
  const category = new Category(link)
  await category.init()
  if (category.error.status) return console.log('JSON answers with 404')
  await category.loadCategories()

  const page = new Page(link)
  await page.loadPages()

  const post = new Post(link)
  await post.loadPosts()
})()
