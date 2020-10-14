module.exports = {
  isValidUrl: (string) => {
    return /^(?:(ftp|http|https)?:\/\/)?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}?(?:\/)?$/gi.test(
      string
    )
  },
  transformUrl: (url) => {
    url = url.toLowerCase()

    // checking for / on the end
    if (url.substr(url.length - 1) !== '/') url += '/'

    // adding http to the start of the url
    if (!url.includes('https://') && !url.includes('http://')) url = `http://${url}`
    return url
  },
  getHost: (url) => {
    const urlData = new URL(url)
    return urlData.host
  }
}
