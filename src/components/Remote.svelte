<script>
  import { io } from "socket.io-client";
  let newSetTemp = "";
  let fridgeValues = { fridgeTemp: "connecting", fridgeSet: "connecting" };
  //   import { InfluxDB } from "@influxdata/influxdb-client";
  //   const url = "http://100.117.236.107:8086/";
  //   const token =
  //     "bLGk23X5swD0VWoyvDrifoAlUP0RoM2h0C3luM-8aEIs68cohe4F1xE2l5jgk_mCqhJmomrp2ohHNOQuqBH0Bw==";
  //   const org = "gustav";
  //   const bucket = "Hoeken";

  //   const query = `\
  // from(bucket:"${bucket}")\
  // |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  //   |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
  //   |> filter(fn: (r) => r["topic"] == "brewpiless/silver/json")
  //   |> filter(fn: (r) => r["_field"] == "fridgeSet" or r["_field"] == "fridgeTemp")
  //   |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  //   |> yield(name: "mean")
  // `;

  //   demo();

  //   async function demo() {
  //     for (let index = 0; index < 300; index++) {
  //       queryExample(query);
  //       await sleep(500);
  //     }
  //   }

  //   function queryExample(fluxQuery) {
  //     const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  //     queryApi.queryRows(fluxQuery, {
  //       next(row, tableMeta) {
  //         const o = tableMeta.toObject(row);
  //         // pushRow(o);
  //         render();
  //       },
  //       complete() {},
  //       error(error) {
  //         console.log("QUERY FAILED", error);
  //       },
  //     });
  //   }

  const socket = io();

  socket.on("connect", function () {
    socket.on("message", function (data) {
      console.log(data);
    });
  });

  socket.on("fridge", (arg) => {
    fridgeValues = JSON.parse(arg); // world
  });

  async function searchForGif(e) {
    try {
      await fetch(`/mqtt?temp=$ ${newSetTemp}`);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<main>
  <div class="search-block">
    <div class="temp">Fridge temp: {fridgeValues.fridgeTemp}</div>
    <div class="temp">Fridge goal temp: {fridgeValues.fridgeSet}</div>
    <input
      type="text"
      placeholder="Send temp to fridge"
      bind:value={newSetTemp}
    />
    <button on:click={searchForGif}>Send</button>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
