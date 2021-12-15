// Allows environement variables to be set on process.env should be at top
require("dotenv").config();
const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const hostname = "127.0.0.1";
const url = require("url");
const qs = require("querystring");


//
// const pool = require("./config/db.js");

const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
 
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.ejs" : req.url
  );
  console.log("this is url " + req.url);
  //test
  //  path = url.parse(filePath,true);
  // let query = path.query;
  if (req.url === "/flight") {
    var rawdata = "";
    req
      .on("data", (data) => {
        rawdata += data;
      })
      .on("end", () => {
        console.log(qs.parse(rawdata));
        var info = qs.parse(rawdata);
    
        console.log(info.date_depart);
        const flights = require("./controllers/flight.js");
        const flightsDispo = new flights();
        flightsDispo.getFlights(
          res,
          req,
          info.date_depart,
          info.from,
          info.to,
          info.place
        );
      });
      return ;
  }
  if(req.url === '/booking'){
    var rawdata = "";
    req
      .on("data", (data) => {
        rawdata += data;
      })
      .on("end", () => {
        console.log(qs.parse(rawdata));
        var info = qs.parse(rawdata);
    
        console.log(info.first_name);
        const flights = require("./controllers/flight.js");
        const flightsDispo = new flights();
        flightsDispo.booking(
          res,
          req,
          info.first_name,
          info.last_name,
          info.email,
          info.mobile,
          info.seats,
          info.id_flight
        );
      });
      return ;
  }

  // if(req.url ==='/'){
  //   const flights = require("./controllers/flight.js");
  //       const flightsList = new flights();
  //       flightsList.getAllFlights(res);

  // }
  //Extension of the file
  let extname = path.extname(filePath);
  //Initial content type
  let contentType = "text/html";

  console.log(extname);
  //Check extension and set content type
  switch (extname) {
    case ".ejs":
      contentType = "text/html";
      break;
    case ".js":
      contentType = "application/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".ico":
      contentType = "image/x-icon";
      break;
  }
  //Read File
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        //Page not found
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (err, content) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content, "utf8");
          }
        );
      } else {
        //Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });

  // let [ controller,method ] = req.url.split("/").filter(part => part!="");

  //     console.log("url parse : ", controller,method);

  //     if(controller != "favicon.ico") {
  //         console.log("in",method);

  //         const controllerInit = require('./controllers/'+controller+".js")
  //     controller = new controllerInit()
  //     let getdata = controller[method];
  //     getdata(res);

  // }
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
// function render(res, htmlFile) {
//     const flights = {
//         id : "1",
//         airline : "casa"
//         }
//         fs.stat(`./${htmlFile}`, (err, stats) => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'text/html');
//             if (stats) {
//                 const content = fs.createReadStream(htmlFile).pipe(res);
//                 // const vols = ejs.render(content,{flights : flights});
//             } else {
//                 res.statusCode = 404;
//                 res.end('Sorry, page not found');
//             }
//         });
//     }
//     server.listen(port, hostname, () => {
//         console.log(`Server running at http://${hostname}:${port}/`);
//     });
