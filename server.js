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
let { InfluxDB } = require("@influxdata/influxdb-client");
let firdgeValues = {};
let influxArr = { 'energy': [], 'dates': [] }

const token = process.env.INFLUXDB_TOKEN;
const org = process.env.INFLUXDB_ORG;
const url = process.env.INFLUXDB_URL;

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
      io.emit("fridge", firdgeValues);
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

    io.emit("fridge", firdgeValues);
    io.emit("influxDB", { 'flux': influxArr, 'fridgeValues': firdgeValues });
  });

  app.use(express.static("public"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });

  server.listen(5001, () => {
    console.log("listening on *5000");
  });

  let getDataInflux = (token, url, org) => {
    const client = new InfluxDB({
      url: url,
      token: token,
    });

    const queryApi = client.getQueryApi(org);

    // Query for fridge temperature
    const query = `from(bucket: "Hoeken")
      |> range(start: -10080m)
      |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
      |> filter(fn: (r) => r["topic"] == "brewpiless/silver/json")
      |> filter(fn: (r) => r["_field"] == "fridgeSet" or r["_field"] == "fridgeTemp")
      |> aggregateWindow(every: 7200s, fn: mean, createEmpty: false)
      |> yield(name: "mean")`;


    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        influxArr.dates.push(o);
      },
      error(error) {
        console.error(error);
        console.log("\\nFinished ERROR");
      },
      complete() {
        console.log("\\nFinished SUCCESS");
      },
    });

    // Query for fridge energy consumption
    const query2 = `from(bucket: "Hoeken")
    |> range(start: -10080m)
    |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
    |> filter(fn: (r) => r["topic"] == "brewpiless/silver/json")
    |> filter(fn: (r) => r["_field"] == "state")
    |> yield(name: "mean")`;

    queryApi.queryRows(query2, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        influxArr.energy.push(o)
      },
      error(error) {
        console.error(error);
        console.log("\\nFinished ERROR");
      },
      complete() {
        console.log("\\nFinished SUCCESS");
      },
    });
  };

  getDataInflux(token, url, org);
};

run();