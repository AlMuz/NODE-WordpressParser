const { Category, Page, Post } = require('./src/classes/index'),
  inquirer = require('./src/utils/inquirer'),
  { initTerminal, clearTerminal, logData } = require('./src/utils/output')

clearTerminal()

initTerminal()
;(async () => {
  // getting WP page link
  let website = await inquirer.getWPPageLink()

  const category = new Category(website)
  await category.init()
  if (category.error.status) return logData('JSON answers with 404', 'red')

  await category.loadCategories()
  if (category.error.status)
    logData('Categories route not found and not downloaded', 'red')

  const { content } = await inquirer.getContentToDownload()

  if (content.includes('Posts')) {
    const post = new Post(website)
    await post.loadPosts()
    if (post.error.status)
      logData('Posts route not found and not downloaded', 'red')
  }

  if (content.includes('Pages')) {
    const page = new Page(website)
    await page.loadPages()
    if (page.error.status)
      logData('Pages route not found and not downloaded', 'red')
  }
})()
