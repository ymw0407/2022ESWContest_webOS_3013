var mongoose = require('mongoose');
const schedule = require('node-schedule');

// mongoDB와 연결
function connectDB(mongoIP){
  return new Promise((resolve, reject) => {
    mongoose
    .connect(mongoIP)
    .then(() => resolve('MongoDB connected'))
    .catch((err) => {
      reject(err)
    });
  })
}
//--------------------------------------------
// mongoDB 연결 끊기
function closeDB(){
    mongoose.connection.close()
    console.log("MongoDB Closed")
}
//--------------------------------------------
// 해당 collection에 들어갈 스키마 설정
function carSchema(collection){
  return new Promise((resolve) => {
    carModel = mongoose.Schema({
      category: {type: String, require: true},
      carNumber: {type: String, require: true},
      startAt: {type: String, require: false},
      expireAt: {type: String, require: false},
      createdAt:{type: Date, default: Date.now},
  });
  var Car = mongoose.model(collection, carModel);
  resolve(Car)
  })
}
//-----------------------------------------------
// 스키마에 해당하는 컬렉션에서 데이터를 꺼내와서 보여줌
function showCarData(Car){
  return new Promise((resolve) => {
    Car.find({})                 
    .sort('startAt') //startAt순서대로 정렬(내림차순이라 -붙음)           
    .exec(function(err, cars){
      console.log("show...")
      let carArray = []
      for (car of cars){
        let parsingData = ""
        parsingData += car.carNumber
        parsingData += " | "
        parsingData += car.startAt.substr(0, 10)
        parsingData += " | "
        parsingData += car.expireAt.substr(0, 10)
        carArray.push(parsingData)
      }
      resolve(carArray)
    });
  }
)}
//-------------------------------------------------
// 스키마에 맞게 데이터를 mongoDB에 넣어준다.
function createRegisterCar(Car, carNumber, startAt, endAt){
  return new Promise((resolve, reject) => {
    var registerCar = new Object();
    registerCar.category = "register";
    registerCar.carNumber = carNumber;
    registerCar.startAt = startAt;
    registerCar.expireAt = endAt;
      Car.create(registerCar, function(err, post){
        if(err) reject(res.json(err))
        resolve("register")
      });
  })
}
//-------------------------------------
//carNumber를 기준으로 같은 데이터가 있으면 데이터를 지운다. 해당 부분은 살짝 수정이 필요할거 같음!!
function deleteCarData(Car, carNumber){
  return new Promise((resolve, reject) => {
    Car.deleteOne({carNumber:carNumber}, function(err){
      if(err) reject(res.json(err))
      resolve("delete success")
    });
  })
}
//-------------------------------------
exports.connectDB = connectDB
exports.closeDB = closeDB
exports.carSchema = carSchema
exports.showCarData = showCarData
exports.deleteCarData = deleteCarData
exports.createRegisterCar = createRegisterCar