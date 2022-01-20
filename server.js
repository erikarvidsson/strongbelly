const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
app.use(cors());
const mqtt = require("mqtt");


// result={"s":"2022-01-12T10:48:08.000Z","v":2,"u":"C","t":[{"c":"t","d":10,"t":5},{"c":"r","d":1},{"c":"g","d":1,"t":5,"g":"1.05"},{"c":"r","d":1},{"c":"u","d":15,"t":5,"s":1}]}

const client = mqtt.connect(process.env.MQTT_ID);

client.options.username = process.env.MQTT_USERNAME;
client.options.password = process.env.MQTT_PAASSWORD;
client.on("connect", function () {
  console.log("Connection succeeded!");
});

app.get("/mqtt", (req, res) => {
  client.subscribe("presence", function (err) {
    if (!err) {
      // client.publish("erik_test", req.query.temp);
      client.publish("brewpiless/silver/beerSet", req.query.temp);
    }
  });

  client.on("message", function (topic, message) {
    console.log(message)
    client.end();
  });

  res.send({
    success: true,
    data: [req.query.temp],
  });
  return;
});

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
