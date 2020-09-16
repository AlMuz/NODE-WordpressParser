const FS = require('fs'),
  PATH = require('path'),
  mime = require('mime-types'),
  axios = require('axios'),
  TurndownService = require('turndown')

const ts = new TurndownService()

const rawdata = FS.readFileSync('./posts.json')
const posts = JSON.parse(rawdata)

posts.forEach((element, index) => {
const link = element._links['wp:attachment'][0].href
const slug = element.slug
const md = `---
title: '${element.title.rendered}'
date: ${element.date}
---
${ts.turndown(element.content.rendered)}
`;
FS.writeFile(`pages/${element.slug}.md`, md, "utf8", () => {});
})

const reducer = (promiseChain, fn) => promiseChain.then( () => fn() )

posts
  .map( element => element._links['wp:attachment'].map( link => [ link, element.slug ] ) )
  .flat()
  .map( ([link, slug]) => () => saveImage(link.href, slug) )
  .reduce( reducer, Promise.resolve() )


[100, 166].map((element) => () => {
  return new Promise(resolve => {
    setTimeout(() => {
      makeRequest(123123)
        .then(() => resolve())
    }, 2000)
  })
})

let main = () => {
  let p = new Promise(r => {

  })
  .then()
  return p
}

main().catch(() => main())
