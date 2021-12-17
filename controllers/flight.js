const pool = require("../config/db.js");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

//mail
var nodemailer = require('nodemailer');



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
      
      //Stocker data flight in localstroge
      console.log(result[0].airline);
      var flightData= [];
     flightData[0] = result[0].airline;
     flightData[1] = result[0].aeroport_depart;
     flightData[2] = result[0].aeroport_arrive;
     flightData[3] = result[0].date_depart;
     flightData[4] = result[0].time_depart;
     if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      var localStorage = new LocalStorage('./scratch');
   }
     localStorage.setItem("flights", JSON.stringify(flightData));

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

  booking(res,req,nom,prenom,email,mobile,place,price,id_flight,){

      let sql = `INSERT INTO reservation(nom,prenom,email,mobile,place,price,id_vols) values ("${nom}","${prenom}","${email}",${mobile},${place},${price},"${id_flight}")`;
      pool.execute(sql, (err, result) => {
          if (err) throw err;
         
          if (req.url == "/favicon.ico") {
            return;
          }else{
          res.writeHead(200, { "Content-Type": "text/html" });
          let html = fs.readFileSync("./public/index.ejs", "utf-8");
          let page = ejs.render(html, { result: result }); 
         res.end(page);
          }
      });
  }
  updateSeats(res,req,seats,id_flight){
    let sql = `update vols 
    set place = place - ${seats}
    where id = ${id_flight}`;
    pool.execute(sql, (err, result) => {
        if (err) throw err;
       
        if (req.url == "/favicon.ico") {
          return;
        }
      //   }else{
      //   res.writeHead(200, { "Content-Type": "text/html" });
      //   let html = fs.readFileSync("./public/index.ejs", "utf-8");
      //   let page = ejs.render(html, { result: result }); 
      //  res.end(page);
      //   }
    });
  }
}

module.exports = flights;
