const http = require('http');
const fs = require('fs');

const HTTPPORT = 8080;

http.createServer(function(request, response){

    if (request.url == '/scripts/main.js'){
        fs.readFile(('./client/scripts/main.js'), function(error, js){
            if (error) { throw error;}
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.write(js);
            response.end();
            return;
        });
    } else if (request.url == '/styles/main.css'){
        fs.readFile(('./client/styles/main.css'), function(error, css){
            if (error) { throw error;}
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(css);
            response.end();
            return;
        });
    } else if (request.url == '/styles/cubemap.css'){
        fs.readFile(('./client/styles/cubemap.css'), function(error, css){
            if (error) { throw error;}
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(css);
            response.end();
            return;
        });
    } else if (request.url == '/styles/cubeview.css'){
        fs.readFile(('./client/styles/cubeview.css'), function(error, css){
            if (error) { throw error;}
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(css);
            response.end();
            return;
        });
    } else {
        fs.readFile(('./Client/index.html'), function(error, html){
            if (error) { throw error;}
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(html);
            response.end();
            return;
        });
    }
}).listen(HTTPPORT);

console.log((new Date()) + ' Server is running on: ' + HTTPPORT);