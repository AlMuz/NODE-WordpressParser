const inquirer = require('inquirer')
const { isValidUrl, transformUrl } = require('.')

module.exports = {
  getWPPageLink: () => {
    return inquirer
      .prompt({
        name: 'website',
        type: 'input',
        message: 'Enter link to the website which need to parse',
        validate: function (value) {
          if (!value.length) return 'Please enter link'
          if (!isValidUrl(value)) return 'Please enter valid link'
          return true
        },
      })
      .then(({ website }) => {
        // return normal URL with http and / on the end
        return transformUrl(website)
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
  confirmData: (text) => {
    return inquirer
      .prompt({
        name: 'confirm',
        type: 'confirm',
        message: text,
      })
      .then(({ confirm }) => confirm)
  },
}
