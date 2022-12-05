// const schedule = require('node-schedule');

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

function carSchema(mongoose, collection) {
    carModel = mongoose.Schema({
        category: { type: String, require: true },
        carNumber: { type: String, require: true },
        startAt: { type: String, require: false },
        expireAt: { type: String, require: false },
        createdAt: { type: Date, default: Date.now },
    });

    var Car = mongoose.model(collection, carModel);
    return Car;
}

function showCarData(Car) {
    Car.find({ category: "register" })
        .sort("-createdAt")
        .exec(function (err, cars) {
            console.log("show...");
            console.log(cars);
            for (let car of cars) {
                if (
                    Date.now() + KR_TIME_DIFF >
                    Date.parse(car.expireAt.split("T")[0]) + 86400000
                ) {
                    console.log(car + " deleted!");
                    deleteCarData(car, car._id);
                }
		console.log(Date.now() + KR_TIME_DIFF)
		console.log(Date.parse(car.expireAt.split("T")[0]) + 86400000)
            }
        });
}

function deleteCarData(Car, id) {
    Car.deleteOne({ _id: id }, function (err) {
        if (err) return res.json(err);
    });
}

exports.carSchema = carSchema;
exports.showCarData = showCarData;
