import http from "http";
import {readFile} from "fs/promises";
// import axios from "axios";
import https from "https";

const API_KEY = "ENTER_YOUR_API_KEY_HERE";  //can get the api from "https://openweathermap.org/api"

const server = http.createServer(async(req,res)=>{
    console.log(req.url);
    try{
        if(req.method==="GET"){ 
            if(req.url==="/"){
    
                try {
                    const htmlFile =await readFile("index.html","utf-8");
                    res.writeHead(200,{"Content-Type":"text/html"});
                    res.end(htmlFile);
                } catch (error) {
                    res.writeHead(500,{"Content-Type":"text/plain"});
                    res.end("Failed to fetch weather data");
                }
            }
            else if(req.url==="/style.css"){
                try{
                    const cssFile = await readFile("style.css","utf-8");
                    res.writeHead(200,{"Content-Type":"text/css"});
                    res.end(cssFile);
                }
                catch(error){
                    res.writeHead(500,{"Content-Type":"text/plain"});
                    res.end("Failed to fetch weather data");
                }
            }
            else if(req.url==="/formSubmission.js"){
                try{
                    const formSubmissionFile = await readFile("formSubmission.js","utf-8");
                    res.writeHead(200,{"Content-Type":"application/javascript"});
                    res.end(formSubmissionFile);
                }
                catch(error){
                    res.writeHead(500,{"Content-Type":"text/plain"});
                    res.end("Failed to fetch weather data");
                }
            }
            else{
                res.writeHead(404,{"Content-Type":"text/plain"});
                res.end("Page not found. Please enter proper url");
            }
        }


        else if(req.method==="POST" && req.url==="/weatherData"){
            let body ="";
            req.on("data",(chunk)=>{
                body+=chunk;
            })
            req.on("end",()=>{
                const city = JSON.parse(body);
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
                https.get(url,(response)=>{
                    let data = "";
                    response.on("data",(chunk)=>{
                        data+=chunk;
                    });
                    response.on("end",()=>{
                        const ParsedCode = JSON.parse(data);
                        if(ParsedCode.cod !==200){
                            res.writeHead(400,{"Content-Type":"text/plain"});
                            res.end(ParsedCode.message);
                        }
                        else{
                            res.writeHead(200,{"Content-Type":"application/json"});
                            res.end(data);
                        }
                    })
                }).on("error",(err)=>{
                    console.log(err);
                    res.writeHead(500,{"Content-Type":"text/plain"});
                    res.end("Failed to fetch weather data");
                })
            })
        }
    }
    catch(err){
        res.writeHead(500,{"Content-Type":"text/plain"});
        res.end("Internal Server Error");
    }
});

server.listen(3000,()=>{
    console.log("Server is active");
})