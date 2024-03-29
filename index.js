const { Category, Page, Post, Media } = require('./src/classes/index'),
  inquirer = require('./src/utils/inquirer'),
  { initTerminal, clearTerminal, logData } = require('./src/utils/output')

clearTerminal()

initTerminal()
;(async () => {
  // getting WP page link
  let website = await inquirer.getWPPageLink()

  const category = new Category(website)
  category.init()
  await category.testRequest()
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
    else {
      if (await inquirer.confirmData('Save all posts as Markdown?'))
        post.markdownData()
    }
  }

  if (content.includes('Pages')) {
    const page = new Page(website)
    await page.loadPages()
    if (page.error.status)
      logData('Pages route not found and not downloaded', 'red')
    else {
      if (await inquirer.confirmData('Save all posts as Markdown?'))
        page.markdownData()
    }
  }

  if (content.includes('Media')) {
    const media = new Media(website)
    await media.loadMedia()
    if (media.error.status)
      logData('Media route not found and not files downloaded', 'red')
  }

  logData('The end.', 'green')
})()
