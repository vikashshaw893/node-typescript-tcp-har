import express from "express";

import path from "path";

import net from "net"

import {config} from "./config/params.config";

import fs from "fs";

const app = express();

app.use(express.static(path.join(__dirname,'public')))

// creating TCP Server
const server = net.createServer(conn => {
  console.log("New Client");

  conn.on('data', data => {
    conn.write(data + "\r\n");
  })

  conn.on('end', () => {
    conn.write("Client Left");
  })
});

// TCP server port setup
server.listen(config.APP_SERVER.PORT);

const fileContents = fs.readFileSync("./public/doc/my.har");
const jsonContents = JSON.parse(fileContents.toString());

// Total request count
const requestUrlCount = jsonContents.log.entries.length
console.log("Request Count: " + requestUrlCount);

// Count of status codes
const responseStatus = jsonContents.log.entries.map(entry => entry.response.status);
const responseStatusCounts = {};
responseStatus.forEach(el => responseStatusCounts[el] = 1  + (responseStatusCounts[el] || 0));
console.log("Status Codes Count: ");
console.log(responseStatusCounts)

// List of all host
const requestHeaders = jsonContents.log.entries.map(entry => entry.request.headers);
const requestHeadersArr = [];
requestHeaders.forEach(element => {
element.forEach(elm=>{
    if(elm.name === "Host")
      requestHeadersArr.push(elm)
  });
});
console.log("List of all host: ");
console.log(requestHeadersArr);


const requestFor500ResponseStatusData = [];
const requestFor500ResponseStatus = jsonContents.log.entries.map(entry => {
  if(entry.response.status.toString() === "500")
  {
    requestFor500ResponseStatusData.push(entry.request)
  }
});
console.log("Request returing 500 response status: ");
console.log(requestFor500ResponseStatusData);




/*app.all( "/", ( req, res ) => {
  res.json( { message: "Hello world!" } );

});


app.post( "/upload-har", ( req, res ) => {
    res.json( { message: "Hello upload har!" } );
});


// start the Express server
app.listen( config.APP_SERVER.PORT, () => {
    console.log( `server started at http://localhost:${ config.APP_SERVER.PORT }` );
});*/

