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
let firdgeValues = {};

let run = async () => {
  function startMqtt() {
    const client = mqtt.connect(process.env.MQTT_ID, {
      clientId,
      clean: true,
      keepalive: 1,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PAASSWORD,
      reconnectPeriod: 1000,
    });

    client.on("connect", function () {
      console.log("MQTT connection succeeded!");
    });

    client.stream.on("error", (err) => {
      console.log("error", err);
      client.end();
    });

    // Get value from frontend and set fridge value remote
    app.get("/mqtt", (req, res) => {
      client.subscribe("brewpiless/silver", function (err) {
        if (!err) {
          client.publish("brewpiless/silver/fridgeSet", req.query.temp);
        }
        console.log(err);
      });
    });

    // Get the message from subscription
    client.on("message", function (topic, message) {
      firdgeValues = message.toString();
    });

    // Subscribe to fridge data
    client.subscribe("brewpiless/silver/json", function (topic, message) {
      console.log("Subscription successful");
    });

    return client;
  }

  // Start and set mqtt client
  let client = startMqtt();

  io.on("connection", function (socket) {
    console.log("a user connected");
    // Restart mqtt sever if offline
    if (socket.connected && !client.connected) {
      client = startMqtt();
      console.log("restart mqtt");
    }

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    // Live update fridge value
    setInterval(() => {
      socket.emit("fridge", firdgeValues);
    }, 3000);
  });

  app.use(express.static("public"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });

  server.listen(5000, () => {
    console.log("listening on *5000");
  });
};

run();
