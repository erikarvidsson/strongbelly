<!-- <script>
  import { InfluxDB } from "@influxdata/influxdb-client";

  // You can generate a Token from the "Tokens Tab" in the UI
  const token =
    "bLGk23X5swD0VWoyvDrifoAlUP0RoM2h0C3luM-8aEIs68cohe4F1xE2l5jgk_mCqhJmomrp2ohHNOQuqBH0Bw==";
  const org = "Hoeken";
  const bucket = "Hoeken";
  const url = "http://100.117.236.107:8086";
  // const client = new InfluxDB({
  //   url: "http://100.117.236.107:8086",
  //   token: token,
  // });

  // import { url, token, org } from "./env";

  const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  const fluxQuery =
    'from(bucket: "Hoeken")|> range(start: -1d, stop: -0d) |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer") |> filter(fn: (r) => r["topic"] == "brewpiless/silver/json") |> filter(fn: (r) => r["_field"] == "fridgeSet" or r["_field"] == "fridgeTemp") |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false) |> yield(name: "mean")';

  console.log("*** QUERY ROWS ***");
  // Execute query and receive table metadata and rows.
  // https://docs.influxdata.com/influxdb/v2.1/reference/syntax/annotated-csv/
  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      // console.log(JSON.stringify(o, null, 2))
      console.log(
        `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
      );
    },
    error(error) {
      console.error(error);
      console.log("\nFinished ERROR");
    },
    complete() {
      console.log("\nFinished SUCCESS");
    },
  });
</script> -->
