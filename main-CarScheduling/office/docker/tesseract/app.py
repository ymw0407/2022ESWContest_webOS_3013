from pymongo import MongoClient
from communicate import Mqtt
from dateutil import parser
from datetime import date, datetime
import ocr
import argparse
import os

MONGODB_URI = "mongodb://3.34.50.139:27017/DB"
conn = MongoClient(MONGODB_URI)
db = conn.DB
cars = db.cars

def run(vid):
    carNumber = Mqtt("carNumber_publisher" ,"car/compare")
    carData = Mqtt("carData_publisher", "car/data")

    try:
        data = ocr.run(vid)[2]
    except TypeError:
        data = "none"
    carInfo = cars.find_one({"carNumber" : data})
    print(carInfo)
    print(datetime.now())
    if carInfo:
        if carInfo["category"] == "register":
            startAt = parser.parse(carInfo["startAt"].split("T")[0])
            if startAt <= datetime.now():
                carNumber.pub("1")
            else:
                carNumber.pub("0")
        if carInfo["category"] == "general":
            carNumber.pub("1")
    else:
        carNumber.pub("0")

    try:
        carData.pub("{ \"carNumber\" : \"" + data + "\", \"category\" : \"" + carInfo["category"] + "\", \"time\" : \"" + str(datetime.now()) + "\"}")
    except TypeError:
        carData.pub("{ \"carNumber\" : \"" + data + "\", \"category\" : \"unknown\", \"time\" : \""  + str(datetime.now()) + "\"}")

    if os.path.exists("/root/images/"+vid):
        os.remove("/root/images/"+vid)

def parse_opt():
    parser = argparse.ArgumentParser()
    parser.add_argument("--vid", type=str, help="video name")
    flags = parser.parse_args()
    opt = vars(flags)
    vid = opt["vid"]
    return vid

if __name__ == "__main__":
    vid = parse_opt()
    run(vid)

