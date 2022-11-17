const schedule = require("node-schedule");
const mongoose = require("mongoose")

// DB setting
mongoose.connect("mongodb://3.34.50.139:27017/DB");
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
