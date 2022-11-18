const schedule = require("node-schedule");
const mongoose = require("mongoose");
require("dotenv").config();

const MongoDB = process.env.MongoDB;

// DB setting
mongoose.connect(MongoDB);
var db = mongoose.connection;
db.once("open", function () {
    console.log("DB connected");
});
db.on("error", function (err) {
    console.log("DB ERROR : ", err);
});

var car = require("./car_expire");
var CAR = car.carSchema(mongoose, "cars");

schedule.scheduleJob("1 * * * * *", function () {
    // console.log(new Date() + ' scheduler running!');
    console.log("---------------------------------------");

    car.showCarData(CAR);
});
