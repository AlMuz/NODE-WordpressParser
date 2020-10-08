const inquirer = require('inquirer')
const { isValidUrl } = require('./utils')

module.exports = {
  getWPPageLink: () => {
    return inquirer.prompt({
      name: 'website',
      type: 'input',
      message: 'Enter link to the website which need to parse',
      validate: function (value) {
        if (!value.length) return 'Please enter link'
        if (!isValidUrl) return 'Please enter valid link'
        return true
      },
    })
  },
  getContentToDownload: () => {
    return inquirer.prompt({
      name: 'content',
      type: 'checkbox',
      message: 'Select content which will be downloaded',
      choices: ['Posts', 'Pages'],
      validate: function (array) {
        if (!array.length) return 'Please select at least one option'
        return true
      },
    })
  },
}
