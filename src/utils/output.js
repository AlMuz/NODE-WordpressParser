const clear = require('clear'),
  chalk = require('chalk'),
  figlet = require('figlet')

initTerminal = () =>
  logData(
    figlet.textSync('NODE WP PARSER', { horizontalLayout: 'full' }),
    'yellow'
  )

clearTerminal = () => clear()

logData = (text, color) => console.log(chalk[color](text))

module.exports = {
  initTerminal,
  clearTerminal,
  logData,
}
