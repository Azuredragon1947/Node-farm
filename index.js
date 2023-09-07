const fs = require('node:fs');
const http = require('node:http');
const url = require('node:url');
const x = require('./modules/replaceTemplate')
const slugify = require('slugify')
//Blocking Model/ Synchronous Model

//Reading a file
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

//Writing a file.
// console.log('Synchronous Model');
// const textOut = 'Avocado -> ' + textIn;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('...File written\n\n');
// console.log('----------------------------------------------------------------');

/////////////////////////////////////////////////////////////////////////

//Non-Blocking Model/ Asynchronous Model\
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//       if (err) return console.log("There is some problem.");
//       fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//             console.log(data1);
//             console.log(data2);
//             fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//                   console.log(data3);
//                   fs.writeFile('./txt/final.txt', `${data2}\n ${data3}`, 'utf-8', (err) => {
//                         if (err) throw err;
//                         console.log("Your file has been written through callback hell.");
//                   })
//             });
//       });
// });
// console.log('Asynchronous Model');
// console.log("Node js will readFile of start.txt in the background and the log will be shown earlier.");

//////////////////////////////////////////////////////////////////////////////

// Creating a SERVER

const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//Creating slugs
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);


const server = http.createServer((req, res) => {
      // console.log(req.url);
      const { query, pathname } = url.parse(req.url, true);
      if (pathname === '/' || pathname === '/overview') {
            res.writeHead(200,
                  {
                        'Content-Type': 'text/html'
                  });

            const cardsHtml = dataObj.map(el => x(templateCard, el)).join('');

            const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
            res.end(output);
      }
      else if (pathname === '/product') {
            res.writeHead(200, {
                  'Content-Type': 'text/html'
            });
            const product = dataObj[query.id];
            const output = x(templateProduct, product);
            res.end(output);
      }
      else if (pathname === '/api') {
            res.writeHead(200, {
                  'Content-Type': 'application/json',
            });
            res.end(data);
      }
      else {
            res.writeHead(404, {
                  'Content-Type': 'text/html',
                  'user-defined-header': 'Hello, world'
            });
            res.end("<h1>Page Not Found!!!</h1>");
      }
});

server.listen(8000, '127.0.0.1', () => {
      console.log('The server is listening to request on port 8000');
});