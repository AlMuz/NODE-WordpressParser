const { Category, Page, Post } = require('./src/classes/index'),
  { transformUrl } = require('./src/utils'),
  clear = require('clear'),
  chalk = require('chalk'),
  figlet = require('figlet'),
  inquirer = require('./src/inquirer')

clear()

console.log(
  chalk.yellow(figlet.textSync('NODE WP PARSER', { horizontalLayout: 'full' }))
)
;(async () => {
  // getting WP page link
  let { website } = await inquirer.getWPPageLink()

  // getting normal URL with http and / on the end
  website = transformUrl(website)

  const category = new Category(website)
  await category.init()
  if (category.error.status)
    return console.log(chalk.red('JSON answers with 404'))

  await category.loadCategories()

  const { content } = await inquirer.getContentToDownload()

  if (content.includes('Posts')) {
    const post = new Post(website)
    await post.loadPosts()
  }

  if (content.includes('Pages')) {
    const page = new Page(website)
    await page.loadPages()
  }
})()
