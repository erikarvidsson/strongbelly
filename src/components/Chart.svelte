<script>
  import { Chart, registerables } from "chart.js";
  import { socket } from "../store.js";
  // import { graphValues } from "../store.js";
  import { onMount, getContext } from "svelte";

  onMount(() => {
    $socket.on("influxDB", (arg) => {
      let graphValues = [];
      let values = [];
      let dates = [];
      arg.flux.dates.map((val) => {
        if (arg.fridgeValues.fridgeSet != val._value) {
          values.push(val._value);
          dates.push(
            `${
              val._time.split("-")[1] +
              "/" +
              val._time.split("-")[2].split("T")[0]
            }-${val._time.split("T")[1].split(":00Z")[0]}`
          );
        }
      });
      graphValues["values"] = values;
      graphValues["dates"] = dates;
      graphValues["energy"] = arg.flux.energy;
      let energyData = [];

      if (graphValues.values != undefined) {
        graphValues.energy.map((value) => {
          energyData[value["_value"]] && energyData[value["_value"]] > -1
            ? (energyData[value["_value"]] = energyData[value["_value"]] + 1)
            : (energyData[value["_value"]] = 1);
        });
      }

      const ctx = document.getElementById("myChart").getContext("2d");
      const ctx2 = document.getElementById("myChart2").getContext("2d");
      var gradientFill = ctx.createLinearGradient(0, 0, 0, 290);
      gradientFill.addColorStop(0, "rgb(255,181,10)");
      gradientFill.addColorStop(1, "rgb(255,228,167)");

      Chart.register(...registerables);
      const myChart = new Chart(ctx, {
        display: false,
        type: "bar",
        data: {
          labels: graphValues.dates,
          datasets: [
            {
              label: "Temp: ",
              data: graphValues.values,
              backgroundColor: gradientFill,

              borderColor: ["#AD35BA"],
              borderWidth: 0,
            },
          ],
          borderWidth: 0,
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(173, 53, 186, 0.1)",
        },
        options: {
          legend: {
            display: false,
          },
          animation: {
            easing: "easeInOutQuad",
            duration: 520,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "rgba(200, 200, 200, 0.05)",
                  lineWidth: 1,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  color: "rgba(200, 200, 200, 0.08)",
                  lineWidth: 1,
                },
              },
            ],
          },
          elements: {
            line: {
              tension: 0.4,
            },
          },
          legend: {
            display: false,
          },
          point: {
            backgroundColor: "white",
          },
          tooltips: {
            titleFontFamily: "Open Sans",
            backgroundColor: "rgba(0,0,0,0.3)",
            titleFontColor: "red",
            caretSize: 5,
            cornerRadius: 2,
            xPadding: 1,
            yPadding: 1,
          },
        },
      });
      const myChart2 = new Chart(ctx2, {
        display: false,
        type: "pie",
        data: {
          labels: [
            "IDLE",
            "STATE_OFF",
            "DOOR_OPEN",
            "HEATING",
            "COOLING",
            "WAITING_TO_COOL",
            "WAITING_TO_HEAT",
            "WAITING_FOR_PEAK_DETECT",
            "COOLING_MIN_TIME",
            "HEATING_MIN_TIME",
          ],
          datasets: [
            {
              label: "Energy Type: ",
              data: energyData,
              backgroundColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 205, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(201, 203, 207, 1)",
                "rgba(210,179,63, 1)",
                "rgba(231,126,49, 1)",
                "rgba(120,28,129, 1)",
              ],
              borderWidth: 0,
            },
          ],
          borderWidth: 0,
          pointBorderColor: "#fff",
        },
        options: {
          legend: {
            display: false,
          },
          animation: {
            easing: "easeInOutQuad",
            duration: 520,
          },
          elements: {
            line: {
              tension: 0.4,
            },
          },
          legend: {
            display: false,
          },
          point: {
            backgroundColor: "white",
          },
          tooltips: {
            titleFontFamily: "Open Sans",
            backgroundColor: "rgba(0,0,0,0.3)",
            titleFontColor: "red",
            caretSize: 5,
            cornerRadius: 2,
            xPadding: 1,
            yPadding: 1,
          },
        },
      });
      myChart.data.datasets[0].data = [...graphValues.values];
      myChart.data.labels = graphValues.dates;
      // myChart2.data.datasets[0].data = [...energyData];
      // myChart2.data.labels = [
      //   "IDLE",
      //   "STATE_OFF",
      //   "DOOR_OPEN",
      //   "HEATING",
      //   "COOLING",
      //   "WAITING_TO_COOL",
      //   "WAITING_TO_HEAT",
      //   "WAITING_FOR_PEAK_DETECT",
      //   "COOLING_MIN_TIME",
      //   "HEATING_MIN_TIME",
      // ];
      myChart.update();
      // myChart2.update();
    });
  });
</script>

<main>
  <div class="left">
    <h1>Temperature</h1>
    <h3>Last 7 days</h3>
    <canvas id="myChart" width="800" height="400" />
  </div>
  <div class="right">
    <h1>Energy Consumption</h1>
    <h3>Last 7 days, 30 second intervals</h3>
    <canvas id="myChart2" width="800" height="400" />
  </div>
</main>

<style>
  div {
    position: absolute;
    display: inline;
    max-width: 38%;
    max-height: 500px;
  }
  h1,
  h3 {
    width: 100%;
    text-align: center;
  }
  .left {
    left: 10%;
  }
  .right {
    right: 10%;
  }
  #myChart {
    position: relative;
  }
  #myChart2 {
    position: relative;
  }
</style>
