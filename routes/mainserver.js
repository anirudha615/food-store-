var mongoose = require ('mongoose'),
    assert = require ('assert');
    
var places = require ('../models/food');
var Verify = require('./verify');   
var express=require('express');
var geoip = require('geoip-lite');

var app = express();

var morgan=require('morgan');

var bodyParser=require('body-Parser');

var hostname ='localhost';

var port = 4050;

app.use(morgan('dev'));
    
var abc = express.Router();
    
abc.use(bodyParser.json());

abc.route('/')
    
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
    places.find({},function(err,result){
        if (err) throw err;
        res.json(result);
    });
    })
    
    .post(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req,res,next){
    places.create(req.body,function(err,result){
        if (err) throw err;
        console.log('Details received');
        var id = result._id;
        res.writeHead(200,{'Content-Type':'Text/plain'});
        res.end('Details received with id:' +id);
            
       
    });
    })
    
    
    .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req,res,next){
    places.remove({},function(err,result){
        if (err) throw err;
        res.json(result);
    });
    });

abc.route('/:detailID')

    
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
    places.findById(req.params.detailID,function(err,result){
        if (err) throw err;
        res.json(result);
    });
    })

   .put(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req,res,next){
   places.findByIdAndUpdate(req.params.detailID,{$set : req.body},{new : true})
   .exec(function(err,result){
       if (err) throw err;
       res.json(result);
   });
    })

    .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req,res,next){
    places.remove(req.params.detailID,function(err,result){
        if (err) throw err;
        res.json(result);
    });
    });

    abc.route('/:detailID/foodstores')

    .get(Verify.verifyOrdinaryUser,function(req,res,next){
        places.findById(req.params.detailID, function(err, result){
            if (err) throw err;
            res.json(result.foodstores);
            
        });
    })
    
    .post(Verify.verifyOrdinaryUser,function(req,res,next){
        places.findById(req.params.detailID, function(err,result){
            if (err) throw err;
            
            result.foodstores.push(req.body);
            result.save(function(err,result){
                if (err) throw err;
                console.log("updated");
                res.json(result);
            });
        });
    })
    
    .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req,res,next){
        places.findById(req.params.detailID, function(err,result){
            if (err) throw err;
            
            for (var i =(result.foodstores.length-1); i>=0 ; i--){
            result.foodstores.id(result.foodstores[i]._id).remove();}
                
                result.save(function(err,result){
                    if (err) throw err;
                    
                    res.writeHead(200,{'content-type' : 'Text/plain'});
                    res.end('Deleted the particular store');
                    
                });
            
        });
    });
    
    
    abc.route('/:detailID/foodstores/:foodstoresID')
    
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
        places.findById(req.params.detailID,function(err,result){
            if (err) throw err;
            res.json(result.foodstores.id(req.params.foodstoresID));
        });
    })
   
   .put(Verify.verifyOrdinaryUser,function(req,res,next){
       places.findById(req.params.detailID,function(err,result){
           if (err) throw err;
           
           result.foodstores.id(req.params.foodstoresID).remove();
           
           result.foodstores.push(req.body);
           result.save(function(err,result){
               if (err) throw err;
               res.json(result);
           });
       });
   })
   
   .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req, res,next){
       places.findById(req.params.detailID,function(err,result){
           if (err) throw err;
           
           result.foodstores.id(req.params.foodstoresID).remove();
           
           result.save(function(err,result){
               if (err) throw err;
               res.json(result);
           });
       });
   });
    
    
    
   app.use('/detail',abc);
   
   app.use(express.static(__dirname + '/public'));

app.listen(port,hostname,function(){
});

module.exports = abc;