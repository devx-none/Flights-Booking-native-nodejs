//Create a server that can send back static files
const http = require("http");
const url = require("url");
const fs = require("fs");
const ejs = require('ejs');

const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;
//npm i mime-types
const lookup = require("mime-types").lookup;

const server = http.createServer((req, res) => {
  //handle the request and send back a static file
  //from a folder called `public`
  let parsedURL = url.parse(req.url, true);
  //remove the leading and trailing slashes
  let path = parsedURL.path.replace(/^\/+|\/+$/g, "");
  /**
   *  /
   *  /index.html
   *
   *  /main.css
   *  /main.js
   */
  if (path == "") {
    path = "index.ejs";
  }
  console.log(`Requested path ${path} `);

  let file = __dirname + "/public/" + path;
  //async read file function uses callback
  fs.readFile(file, function(err, content) {
    if (err) {
      console.log(`File Not Found ${file}`);
      res.writeHead(404);
      res.end();
    } else {
      //specify the content type in the response
      console.log(`Returning ${path}`);
      res.setHeader("X-Content-Type-Options", "nosniff");
        let mime = lookup(path);
        console.log(lookup(path));
        // let html = ejs.render(fs.readFileSync(file));
        res.writeHead(200, { "Content-type": mime });
        res.end(ejs.render(content,{name : "hello"}));
        
    //   switch (path) {
    //     case "main.css":
    //       res.writeHead(200, { "Content-type": "text/css" });
    //       break;
    //     case "main.js":
    //       res.writeHead(200, { "Content-type": "application/javascript" });
    //       break;
    //     case "index.html":
    //       res.writeHead(200, { "Content-type": "text/html" });
    //   }
      res.end(content);
    }
  });
});

server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });