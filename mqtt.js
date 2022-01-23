const mqtt = require("mqtt");

function connectMqtt() {
  const client = mqtt.connect(process.env.MQTT_ID);
  global.client = client;
  global.client.options.username = process.env.MQTT_USERNAME;
  global.client.options.password = process.env.MQTT_PAASSWORD;

  client.on("connect", function () {
    console.log("Connection succeeded!");
  });

  client.stream.on("error", (err) => {
    console.log("error", err);
    client.end();
  });
}

function getMqttMessage() {
  console.log("Hello from get Mqtt");
  global.client.on("message", function (topic, message) {
    console.dir(message.toString());
    global.client.end();
  });
}

function sendMqttMessage(mTopic, mValuee) {
  console.log("Hello from send Mqtt");
  global.client.subscribe("presence", function (err) {
    if (!err) {
      // global.client.publish("erik_test", req.query.temp);
      global.client.publish(mTopic, mValuee);
    }
  });
}

module.exports = { connectMqtt, getMqttMessage, sendMqttMessage };
