var express=require('express');
var routerapp = express.Router();
var geoip = require('geoip-lite');
        
routerapp.get('/', function(req,res,next){
    
var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
var ip = "124.124.205.118";
var geo = geoip.lookup(ip);

console.log(geo);
res.json(geo);
console.log("The IP is %s", geoip.pretty(ip));

geoip.startWatchingDataUpdate();

});

module.exports = routerapp;