var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/thelist',function(req,res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/test';             //duong dan den database
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("unable to connect to database",err);
    }
    else
    {
      console.log("connection Established !! :D");


      var collection = db.collection('test');             //chon table
      collection.find({}).toArray(function(err,result){
        if(err){
          res.send(err);
        }


        else if(result.length){
          res.render('studentList',{ los :result });          //los:list of student
        }
        else
        {
          res.send('no document fount in database');
        }

        db.close();
      });

    }
  });
});

router.get('/newstudent', function(req,res){
  res.render('NewStudent',{ title: "new student"});
});

router.get('/newstudent',function(req,res){
  req.render('NewStudent',{title:"Add Student"});
});
router.post('/AddStudent',function(req,res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/test';
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Unable to connect to server while add new student!!");
    }
    else
    {
      console.log("server are already to connect to add new student!!");
      var collection = db.collection('test');
      var newStudent = {
        student: req.body.student,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        sex: req.body.sex,
        gpa: req.body.gpa
      };
      collection.insert([newStudent],function(err,result){
        if(err){
          console.log(err);
        }
        else
        {
          res.redirect("thelist");
        }
        db.close();
      });
    }
  });
});
module.exports = router;
