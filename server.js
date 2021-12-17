// Allows environement variables to be set on process.env should be at top
require("dotenv").config();
const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const hostname = "127.0.0.1";
const url = require("url");
const qs = require("querystring");
//mail
var nodemailer = require("nodemailer");

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
    return;
  }
  if (req.url === "/booking") {
    var rawdata = "";
    req
      .on("data", (data) => {
        rawdata += data;
      })
      .on("end", () => {
        // console.log(qs.parse(rawdata));
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
          info.price,
          info.id_flight
        );

           //...get data using locale storage
      if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        var localStorage = new LocalStorage('./scratch');
     }
    var dataFlight = JSON.parse(localStorage.getItem("flights"))
    console.log("localStorage:"+dataFlight[0]);
        //update seats flight
        flightsDispo.updateSeats(res,req,info.seats,info.id_flight)

        //mail
        main(info.first_name, info.last_name,dataFlight[0],dataFlight[1],dataFlight[2],dataFlight[3],dataFlight[4], info.email, info.price).catch(
          console.error
        );
      
      });
      
  

    async function main(first_name, last_name,airline,from,to,date,time, email, price) {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();
      // Send mail

      const output = `
      <h2> Welcome Mr : ${first_name} ${last_name}</h2>
      <h3> Flight Details </h3>
      <ul>
      <li>Airline :${airline}  </li>
      <li>From : ${from} </li>
      <li>To   : ${to}} </li>
      <li>Departue :  ${date} at ${time} </li>
      </ul>
      <h4>Price : ${price}`;

      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: "Gmail",
        auth: {
          user: "checker.safiairline@gmail.com", // generated ethereal user
          pass: "SafiAIrline@123", // generated ethereal password
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"SAFIAIR" <checker.safiairline@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Flight Details", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
      });
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    return;
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
