require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session'); 
var app = express();
const schedule = require('node-schedule');
var path = require('path');
var car = require('./car_expire/car_expire')
// const weather = require('./weather/weather');

// DB setting
mongoose.connect("mongodb+srv://yun1211:yunbird1211@cluster0.znfuk.mongodb.net/DB?retryWrites=true&w=majority");
//mongoose.connect("mongodb+srv://yun1211:yunbird1211@cluster0.znfuk.mongodb.net/CAR?retryWrites=true&w=majority");
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

function carSchema(collection){
  //car 일반차량
  //https://www.mongodb.com/docs/manual/tutorial/expire-data/
  carModel = mongoose.Schema({
      category: {type: String, require: true},
      carNumber: {type: String, require: true},
      startAt: {type: String, require: false},
      expireAt: {type: String, require: false},
      createdAt:{type: Date, default: Date.now},
      // closerOfferat: ISODate()
  });
  var Car = mongoose.model(collection, carModel);
  return Car
}

function showCarData(Car){
    Car.find({})                 
  .sort('-createdAt') //createdAt순서대로 정렬(내림차순이라 -붙음)           
  .exec(function(err, cars){
    console.log("show...")
    for (let car of cars) {
        // console.log(car);
        // console.log(Date.now());
        // console.log(Date.parse(car.expireAt))
        if (Date.now() >= Date.parse(car.expireAt)){
            console.log(car + " deleted!")
            deleteCarData(car, car._id)
        }
    }
  });
}

function showCarData(Car){
  Car.find({})                 
.sort('-createdAt') //createdAt순서대로 정렬(내림차순이라 -붙음)           
.exec(function(err, cars){
  console.log("show...")
  for (let car of cars) {
      console.log(car);
      // console.log(Date.now());
      // console.log(Date.parse(car.expireAt))
      if (Date.now() >= Date.parse(car.expireAt)){
          console.log(car + " deleted!")
          deleteCarData(car, car._id)
      }
  }
});
}

// Other settings
app.set('view engine', 'ejs');
// app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash()); 
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true})); 

app.engine('html', require('ejs').renderFile);  //html로 렌더링

// Routes
app.use('/', require('./routes/post'));

// Port setting
var port = 8080;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
  var CAR = car.carSchema(mongoose, "cars");

  /*-------------------weather alarm------------------------- */
  schedule.scheduleJob('0 * * * * *', function(){
    // console.log(new Date() + ' scheduler running!');
    var weather = require('./weather/weather');
    
  });

  schedule.scheduleJob('1 * * * * *', function(){
    // console.log(new Date() + ' scheduler running!');
    console.log("---------------------------------------")
    
    car.showCarData(CAR);
  });
})
