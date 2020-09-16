const { Main } = require('./Main')

class Post extends Main {
  constructor() {
    super()
    this.createFolder('data/posts')
  }


  savePost(){
    saveImage(123)

  }
}

module.exports = { Post }
