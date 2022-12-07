const mosquitto = require("mqtt");
const mqtt = require("./mqtt_lib");

require("dotenv").config();

const MQTT = process.env.MQTT

mqtt.init(mosquitto);
client = mqtt.connect(MQTT);
mqtt.publish("exercise/next", "1")