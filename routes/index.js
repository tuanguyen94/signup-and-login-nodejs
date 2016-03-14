var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var crypto = require('crypto');


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.cookies.cookieUser == null)
  {
    res.cookie('cookieUser',"no one");
  }
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/spiderum';             //duong dan den database
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("unable to connect to database",err);
    }
    else
    {
      console.log("connection Established !! :D");

      var collection = db.collection('user');             //chon table
      collection.find({
        cookieUser: req.cookies.cookieUser
      }).toArray(function(err,result){
        if(err){
          res.send(err);
        }
        else if(result.length){
          res.render('index', { title: 'Express',user: result[0].username });
        }
        else
        {
          res.render('index', { title: 'Express',user: "no one" });
        }

        db.close();
      });
    }
  });
});

router.get('/login',function(req,res){
  res.render('login',{title : "Login"})
});

router.post('/login',function(req,res){
  //connect to database, find and check user
  //database: spiderum
  //table: user
  console.log("you are logning");
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/spiderum';             //duong dan den database
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("unable to connect to database",err);
    }
    else
    {
      console.log("connection Established !! :D");


      var collection = db.collection('user');             //chon table
      collection.find({
        username: req.body.username,
        password: req.body.password
      }).toArray(function(err,result){
        if(err){
          res.send(err);
        }
        else if(result.length){
          //res.cookie('user',req.body.username);
          //var message = crypto.md5.encrypt('Nội dung cần mã hóa', 'itsasecret123').toString();
          if(req.body.remember){
            var exdate = new Date();
            exdate.setDate(exdate.getDate()+10);
            res.cookie('cookieUser',crypto.createHash('md5').update(req.body.username).digest('hex'),{expires:exdate});
            res.redirect('/');
          }
          else
          {
            res.render('index', { title: 'Express',user: req.body.username });
          }

        }
        else
        {
          res.send('wrong user name or password');
        }

        db.close();
      });
    }
  });
});

router.get('/signup',function(req,res){
  res.render('signup',{title:"Signup"});
});
router.post('/signup',function(req,res){
  //database: spiderum
  //table: user
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/spiderum';             //duong dan den database
  MongoClient.connect(url,function(err,db) {
    if (err) {
      console.log("unable to connect to database", err);
    }
    else {
      console.log("connection Established !! :D");
      var collection = db.collection('user');             //chon table
      collection.find({
        username: req.body.username
        //password: req.body.password
      }).toArray(function (err, result) {
        if (err) {
          res.send(err);
        }
        else if (result.length) {
          //username da ton tai
          res.send('your username has already exsist !!!');
          //los:list of student
        }
        else {
          //username chua trung
          //them ten nguoi dung vao database
          var collection = db.collection('user');
          var newuser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            cookieUser: crypto.createHash('md5').update(req.body.username).digest('hex')
          };
          collection.insert([newuser], function (err, result) {
            if (err) {
              console.log(err);
            }
            var exdate = new Date();
            exdate.setDate(exdate.getDate()+10);
            res.cookie('cookieUser',crypto.createHash('md5').update(req.body.username).digest('hex'),{expires:exdate});
            res.redirect('/');
          });
          db.close();
        }
      });
    }       //else {}
  });
});

function refreshSession(){
  var temp = req.session.passport; // {user: 1}
  req.session.regenerate(function(err){
    //req.session.passport is now undefined
    req.session.passport = temp;
    req.session.save(function(err){
      res.send(200);
    });
  });
}
router.get('/logout',function(req,res){
  res.cookie('cookieUser',0);
  res.render('index',{title: 'Express',user: "no one"})
});

module.exports = router;
