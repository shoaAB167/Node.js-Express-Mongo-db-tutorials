const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate');
const parse = require('url-parse');
/*************************************************** 
 //Files
//blocking, synchronous way
const textIn = fs.readFileSync('./txt/input.txt','utf8');
console.log(textIn);
const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textOut);
console.log("File written");


//Non-blocking asynchronous way
fs.readFile('./txt/start.txt', 'utf8', (err,data1)=>{
    if(err)
      return console.log("ERROR");
    fs.readFile(`./txt/${data1}.txt`, 'utf8', (err,data2)=>{
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf8', (err,data3)=>{
            console.log(data3);
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf8', err => {
                console.log("Your file has been written");
            })
        })
    })
});
console.log("will read file");

****************************************************/
//server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data);

const server = http.createServer( (req,res) =>{
    
    //const {query, pathName} = url.parse(req.url,true);
    const url = parse(req.url, true);
    const {pathname , query} = url;
    //const pathName = req.url;
    
        //overview
    if(pathname === "/" || pathname === "/overview"){
        res.writeHead(200,{'content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
        res.end(output);
        //product
    }else if(pathname === '/product'){
        res.writeHead(200, {"Content-type": "text/html"});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        //api
    }else if(pathname === '/api'){
        res.writeHead(200,{'content-type':'application/json'});
        res.end(data);
    }else{
        res.writeHead(404,{
            'content-type': 'text/html',
            'my-own-header': 'Hello-World'
        });
        res.end("<h1>Page not Found!</h1>");
    }
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log("server started at 8000");
});