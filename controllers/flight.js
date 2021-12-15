const pool = require("../config/db.js");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

//mail
var nodemailer = require('nodemailer');


const querystring = require("querystring");

class flights {
  
  getAllFlights(res){
    let sql = `SELECT * FROM vols`;
    pool.execute(sql, (err, result) => {
      if (err) throw err;
      console.log("result", result);
    
      res.writeHead(200, { "Content-Type": "text/html" });
      let html = fs.readFileSync("/", "utf-8");
      let page = ejs.render(html,{result:result});
      // res.write(page);
      res.end(page);
      
    });
  }
  
    getFlights(res,req,date_depart, aeroport_depart, aeroport_arrive, place) {

    let sql = `SELECT * FROM vols where date_depart = "${date_depart}" AND aeroport_depart = "${aeroport_depart}" AND aeroport_arrive = "${aeroport_arrive}" AND place >=${place}`;
    pool.execute(sql, (err, result) => {
      if (err) throw err;
      console.log("result", result);
      
      // let filePath = path.join(__dirname,
      //     'public', req.url);
      //     let name =['name', 'type'];
      // let html = ejs.render(fs.readFileSync(`./public/index.ejs`),{result: name});
      // res.end(html);
      if (req.url == "/favicon.ico") {
        return;
      }else{
      res.writeHead(200, { "Content-Type": "text/html" });
      
      let html = fs.readFileSync("./public/flights.ejs", "utf-8");
      let page = ejs.render(html, { result: result }); 
     res.end(page);
      }
    });
  }

  booking(res,req,nom,prenom,email,mobile,place,id_flight,){

      let sql = `INSERT INTO reservation(nom,prenom,email,mobile,place,id_vols) values ("${nom}","${prenom}","${email}",${mobile},${place},"${id_flight}")`;
      pool.execute(sql, (err, result) => {
          if (err) throw err;
         
          if (req.url == "/favicon.ico") {
            return;
          }else{
          res.writeHead(200, { "Content-Type": "text/html" });
          // let html = fs.readFileSync("./public/index.ejs", "utf-8");
          // let page = ejs.render(html);
          // res.write(page);
          // res.end();
          let html = fs.readFileSync("./public/Booking.ejs", "utf-8");
          let page = ejs.render(html, { result: "success" }); 
         res.end(page);
          }
          

      });
  }
}

module.exports = flights;
