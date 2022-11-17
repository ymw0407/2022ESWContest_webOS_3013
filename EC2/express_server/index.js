require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var session = require("express-session");
var app = express();
const schedule = require("node-schedule");
var path = require("path");
var car = require("./car_expire/car_expire");

// DB setting
mongoose.connect("mongodb://3.34.50.139:27017/DB");
var db = mongoose.connection;
db.once("open", function () {
    console.log("DB connected");
});
db.on("error", function (err) {
    console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
// app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({ secret: "MySecret", resave: true, saveUninitialized: true }));

app.engine("html", require("ejs").renderFile); //html로 렌더링

// Routes
app.use("/", require("./routes/post"));

// Port setting
var port = 8080;
app.listen(port, function () {
    console.log("server on! http://localhost:" + port);
    var CAR = car.carSchema(mongoose, "cars");

    schedule.scheduleJob("1 * * * * *", function () {
        // console.log(new Date() + ' scheduler running!');
        console.log("---------------------------------------");

        car.showCarData(CAR);
    });
});
