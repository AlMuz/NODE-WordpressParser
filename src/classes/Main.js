const FS = require('fs'),
  PATH = require('path'),
  mime = require('mime-types'),
  axios = require('axios'),
  TurndownService = require('turndown')

const ts = new TurndownService()

const { CHECK_ENDPOINT } = require('../CONSTANTS'),
  { getHost } = require('../utils'),
  { logData } = require('../utils/output')

class Main {
  constructor(link = '') {
    this.error = {}
    this.link = link
    this.folderName = getHost(link)
  }

  init() {
    logData('Parser initialization', 'green')
    if (!this.folderExists('data')) {
      this.createFolder('data')
    }

    if (!this.folderExists(`data/${this.folderName}`)) {
      this.createFolder(`data/${this.folderName}`)
    }
  }

  async testRequest() {
    await this.makeRequest(`${this.link}${CHECK_ENDPOINT}`)
  }

  reducer(promiseChain, fn) {
    return promiseChain.then(() => fn())
  }

  async saveFile(link, type, name, folder) {
    const extension = mime.extension(type)
    const fileName = `${name}.${extension}`

    try {
      console.log(`Downloading file - ${fileName}`)

      const path = PATH.resolve(folder, fileName)
      const writer = FS.createWriteStream(path)

      const response = await axios({
        url: link,
        method: 'GET',
        responseType: 'stream',
      })

      response.data.pipe(writer)
    } catch (error) {
      logData(`File ${fileName} has error - ${error.response.status}`, 'red')
      return Promise.resolve()
    }
  }

  operateMarkdown(md, content, file, path) {
    md += ts.turndown(content)
    this.saveData(file, path, md)
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

    if (this.error.status) return []
    const total = response.headers['x-wp-total']
    const pages = Math.ceil(total / 100)

    logData(
      `Total content elements for ${this.constructor.name} - ${total}`,
      'green'
    )

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
    console.log('Making request to', url)
    return axios({
      url,
      responseType,
    }).catch((err) => {
      const status = err.response ? err.response.status : 404
      this.error = { status, link: this.link }
    })
  }
}

module.exports = { Main }
