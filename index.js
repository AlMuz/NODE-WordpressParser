const { Category, Page, Post } = require('./classes/index')
const link = 'https://creditprime.md/'

;(async () => {
  const category = new Category(link)
  await category.init()
  if (category.error.status) return console.log('JSON answers with 404');
  await category.loadCategories()
  // console.log(category.categories)
})()

// setTimeout(() => {
//   new Page()
// }, 5000)

// setTimeout(() => {
//   new Post()
// }, 7000)
// console.log(category);
// // // const https = require("https");
// const fs = require("fs");

// // https
// //   .get("https://creditplus.ru/wp-json/wp/v2/posts?per_page=100", (res) => {
// //     res.setEncoding('utf8');
// //     let data = "";

// //     // A chunk of data has been recieved.
// //     res.on("data", (chunk) => {
// //       data += chunk;
// //     });

// //     // The whole response has been received. Print out the result.
// //     res.on("end", () => {
// //       fs.writeFile(`posts.json`, data, "utf8", () => {});
// //     });
// //   })
// //   .on("error", (err) => {
// //     console.log("Error: " + err.message);
// //   });
