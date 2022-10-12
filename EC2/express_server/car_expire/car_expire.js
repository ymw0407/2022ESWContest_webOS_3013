const schedule = require('node-schedule');

function carSchema(mongoose, collection){
    carModel = mongoose.Schema({
        category: {type: String, require: true},
        carNumber: {type: String, require: true},
        startAt: {type: String, require: false},
        expireAt: {type: String, require: false},
        createdAt:{type: Date, default: Date.now},
    });

    var Car = mongoose.model(collection, carModel);
    return Car
}

function showCarData(Car){
    Car.find({})                 
  .sort('-createdAt') 
  .exec(function(err, cars){
    console.log("show...")
    console.log(cars);
    for (let car of cars) {
        if (Date.now() >= Date.parse(car.expireAt)){
            console.log(car + " deleted!")
            deleteCarData(car, car._id)
        }
    }
  });
}

function deleteCarData(Car, id){
    Car.deleteOne({_id:id}, function(err){
        if(err) return res.json(err);
      });
}

exports.carSchema = carSchema
exports.showCarData = showCarData
