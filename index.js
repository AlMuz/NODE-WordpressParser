// const { Category, Page, Post } = require('./classes/index')
const clear = require('clear'),
  chalk = require('chalk'),
  figlet = require('figlet'),
  inquirer = require('./src/inquirer')

clear()

console.log(
  chalk.yellow(figlet.textSync('NODE WP PARSER', { horizontalLayout: 'full' }))
)

;(async () => {
  const { website } = await inquirer.getWPPageLink()
  console.log(website)

  const { content } = await inquirer.getContentToDownload()
  console.log(content)
  //   const category = new Category(link)
  //   await category.init()
  //   if (category.error.status) return console.log('JSON answers with 404')
  //   await category.loadCategories()

  //   const page = new Page(link)
  //   await page.loadPages()

  //   const post = new Post(link)
  //   await post.loadPosts()
})()
