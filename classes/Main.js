const FS = require('fs'),
  PATH = require('path'),
  mime = require('mime-types'),
  axios = require('axios'),
  TurndownService = require('turndown')

const ts = new TurndownService()

const { CHECK_ENDPOINT } = require('../CONSTANTS')

class Main {
  constructor(link = '') {
    this.error = {}
    this.link = link
  }

  async init() {
    console.log('init')
    if (!this.folderExists('data')) {
      this.createFolder('data')
    }

    if (this.link) {
      await this.makeRequest(`${this.link}${CHECK_ENDPOINT}`)
    }
  }

  reducer(promiseChain, fn) {
    return promiseChain.then(() => fn())
  }

  async saveImage(url, slug) {
    try {
      const response = await axios.get(url)

      response.data.forEach(async (element) => {
        const extension = mime.extension(element.mime_type)
        const link = element.source_url
        console.log(`${slug}.${extension}`)
        const path = PATH.resolve(__dirname, 'images', `${slug}.${extension}`)
        const writer = FS.createWriteStream(path)

        const response = await axios({
          url: link,
          method: 'GET',
          responseType: 'stream',
        })

        response.data.pipe(writer)
      })
    } catch (error) {
      console.error(error)
    }
  }

  saveData(file, path, data) {
    try {
      FS.writeFile(`${path}${file}`, data, 'utf8', () => {})
    } catch (error) {
      console.log(error)
    }
  }

  encodeQueryData(object) {
    const ret = []

    for (let d in object) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(object[d]))
    }

    return `?${ret.join('&')}`
  }

  folderExists(name) {
    return FS.existsSync(name)
  }

  createFolder(name, recursive = false) {
    const options = {}

    if (recursive) {
      options.recursive = true
    }

    return FS.mkdirSync(name, options)
  }

  deleteFolder(folderName) {
    return FS.rmdirSync(folderName, { recursive: true })
  }

  checkFolder(folder) {
    if (!this.folderExists(folder)) {
      this.createFolder(folder)
    } else {
      this.deleteFolder(folder)
      this.createFolder(folder)
    }
  }

  async loadData(folder, url, fn) {
    this.checkFolder(folder)
    const response = await this.makeRequest(url)
    const total = response.headers['x-wp-total']
    const pages = Math.ceil(total / 100)

    console.log('TOTAL', total)
    if (total > 100) {
      // making request array
      const requests = []
      for (let index = 1; index <= pages; index++) {
        const options = this.encodeQueryData({
          per_page: 100,
          offset: 100 * (index - 1),
        })
        requests.push(`${url}${options}`)
      }

      // executing requests array one after each other
      return await requests
        .map((link) => async () => await fn(link, this))
        .reduce(this.reducer, Promise.resolve())
    } else if (total > 10 && total <= 100) {
      const options = this.encodeQueryData({
        per_page: total,
      })

      const response = await this.makeRequest(`${url}${options}`)

      return response.data
    } else {
      return response.data
    }
  }

  async makeRequest(url, responseType = 'text') {
    this.link = url
    console.log('request to', url)
    return axios({
      url,
      responseType,
    }).catch((err) => {
      this.error = { status: err.response.status, link: this.link }
    })
  }
}

module.exports = { Main }
