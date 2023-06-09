// FileSystem
const fs = require("fs");
// Http
const http = require("http");
const path = require("path");
// URL
const url = require("url");

const slugify = require("slugify");

//                          MODULES
// Replace Template
const replaceTemplate = require("./modules/replaceTemplate");

//                          FILES
////////////////////////////////////////////////////
/*
// Blocking, synchronous way
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}.`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File Written!");

// Non-Blicking, asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log(`ERROR! ${err}`);

  fs.readFile(`./txt/${data1}.txt`, `utf-8`, (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, `utf-8`, (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log(`Your file has been written`);
      });
    });
  });
});
console.log("Reading File....");
*/
////////////////////////////////////////////////////
//                          Server

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// called each time a request is sent
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // Overview Page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    const output = tempOverview.replace(
      "{%PRODUCT_CARDS%}",
      cardsHtml.join("")
    );
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

const PORT = 8000;

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening to requests on port ${PORT}`);
});
