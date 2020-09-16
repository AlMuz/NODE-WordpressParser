const { Main } = require('./Main')

class Page extends Main {
  constructor() {
    super()
    this.createFolder('data/pages')
  }
}

module.exports = { Page }
