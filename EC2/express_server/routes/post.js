var express  = require('express');
var router = express.Router();
var Post = require('../models/Post');
var util = require('../util');
const mosquitto = require("mqtt");
const mqtt = require("./mqtt_lib");

const ip = "3.34.50.139";
mqtt.init(mosquitto);
/*---------------------------notice------------------------- */
// Index 
router.get('/', function(req, res){
    //시간순 정렬
    Post.find({selectbox:'notice'})                 
  .sort('-createdAt') //createdAt순서대로 정렬(내림차순이라 -붙음)           
  .exec(function(err, posts){    
    if(err) return res.json(err);
    res.render('posts/notice/notice', {posts:posts});
  });
});

// New
router.get('/notice/new', function(req, res){
  res.render('posts/notice/new');
});

// create
router.post('/', function(req, res){
  console.log(req.body);
  //post 받으면 정리 이 데이터만 데베에 저장
  var noticeRequest = new Object();
  noticeRequest.selectbox = 'notice';
  noticeRequest.title = req.body.title;
  noticeRequest.body = req.body.body;

  if(req.body.password == "notice"){  //DB에 올리기
    Post.create(noticeRequest, function(err, post){
      if(err) return res.json(err);
      res.redirect('/');
      });
  }
    else{
      res.redirect('/');
    }

  //알림 체크한 경우
  if (req.body.notification == 'on'){ 
    noticeRequest.startTime = util.time(req.body.startTime);
    noticeRequest.endTime = util.time(req.body.endTime);
    var noticeSend = {
      content: {title:noticeRequest.title, body:noticeRequest.body}, 
      recommend: true,
      control: {device:req.body.appliance, func: req.body.operation},
      time: {start:noticeRequest.startTime, end:noticeRequest.endTime},
      
    };
  } else {
    noticeRequest.startTime = util.time(req.body.startTime);
    noticeRequest.endTime = util.time(req.body.endTime);
    var noticeSend = {
      content: {title:noticeRequest.title, body:noticeRequest.body}, 
      recommend: false,
    };
  }
  console.log(noticeSend)
  var jsonString = JSON.stringify(noticeSend);      //jsonString:  [{"title":"r","content":"ew"},{"start":"2022-09-13 03:35:00","end":"2022-09-29 15:23:00"},{"appliance":"blind","operation":"on"}]
  mqtt.connect(ip);
  mqtt.publish("post/notice", jsonString);
});

// show
router.get('/notice/:id', function(req, res){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    res.render('posts/show', {post:post});
  });
});

// edit
router.get('/:id/edit', function(req, res){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    res.render('posts/edit', {post:post});
  });
});

// update
router.put('/posts/:id', function(req, res){
    if(pass == req.body.password){
        req.body.updatedAt = Date.now(); 
        Post.findOneAndUpdate({_id:req.params.id}, req.body)
            .exec(function(err, post){
        if(err) return res.json(err);
        res.redirect("/notice/"+req.params.id);
    });
    } else{
        //비번 틀렸다는 알림 띄우기
        res.redirect("/notice/"+req.params.id);
    }
});

// destroy
// 비번 하고 삭제되어야 하는데 걍 됨
router.delete('/:id', function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/');
  });
});

/*---------------------------general------------------------- */
//Index
router.get('/general', function(req, res){
    //시간순 정렬
    Post.find({selectbox:'general'})                 
  .sort('-createdAt') //createdAt순서대로 정렬(내림차순이라 -붙음)           
  .exec(function(err, posts){    
    if(err) return res.json(err);
    res.render('posts/general/general', {posts:posts});
  });
});

// New
router.get('/general/new', function(req, res){
    res.render('posts/general/new');
  });

// create
router.post('/general', function(req, res){
  var generalRequest = new Object();
  generalRequest.selectbox = 'general';
  generalRequest.title = req.body.title;
  generalRequest.body = req.body.body;
  if(req.body.password == "general"){
    Post.create(generalRequest, function(err, post){
      if(err) return res.json(err);
      res.redirect('/general');
      });
    }
    else{
      res.redirect('/');
    }
  });

// show
router.get('/general/:id', function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
      if(err) return res.json(err);
      res.render('posts/show', {post:post});
    });
  });

// update
router.put('/general/posts/:id', function(req, res){
    if(req.body.password == "general"){
        req.body.updatedAt = Date.now(); 
        Post.findOneAndUpdate({_id:req.params.id}, req.body)
            .exec(function(err, post){
        if(err) return res.json(err);
        res.redirect("/general/"+req.params.id);
    });
    } else{
        //비번 틀렸다는 알림 띄우기
        res.redirect("/general/"+req.params.id);
    }
});

// destroy
// 비번 하고 삭제되어야 하는데 걍 됨
router.delete('/general/:id', function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
      if(err) return res.json(err);
      res.redirect('/posts/general');
    });
  });

module.exports = router;
