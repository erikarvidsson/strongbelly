const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const http = require("http");
app.use(cors());
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const mqtt = require("mqtt");
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

let firdgeValue = {};

const client = mqtt.connect("mqtt://100.117.236.107:1883", {
  clientId,
  clean: true,
  connectTimeout: 10000,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PAASSWORD,
  reconnectPeriod: 1000,
});

client.on("connect", function () {
  console.log("Connection succeeded!");
});

client.stream.on("error", (err) => {
  console.log("error", err);
  client.end();
});
app.get("/mqtt", (req, res) => {
  // sendMqttMessage("brewpiless/silver/fridgeSet", req.query.temp);
  client.subscribe("brewpiless/silver", function (err) {
    if (!err) {
      client.publish("brewpiless/silver/beerSet", req.query.temp);
    }
    console.log(err);
  });
});

client.on("message", function (topic, message) {
  firdgeValue = message.toString();
});

client.subscribe("brewpiless/silver/json", function (topic, message) {
  console.log("Subscription successful");
});

io.on("connection", (socket) => {
  setInterval(() => {
    socket.emit("fridge", firdgeValue);
  }, 2000);
});

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

server.listen(5000, () => {
  console.log("listening on *5000");
});
