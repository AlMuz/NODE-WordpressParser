// const fs = require('fs')
// if (!fs.existsSync('test/')) {
//   fs.mkdirSync('test')
//   console.log(123);
// }
// fs.writeFile('test/test.text', '123', function(err) {
//   console.log(err);
// })

// // fs.dir
const axios = require('axios')



makeRequest(url, responseType = 'text') {
  return await axios({
    url,
    responseType,
  })
}
