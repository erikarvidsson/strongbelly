<script>
  import { Chart, registerables } from "chart.js";
  import { socket } from "../store.js";
  // import { graphValues } from "../store.js";
  import { onMount, getContext } from "svelte";
  $: graphValues = [];
  let rerender = 0;

  onMount(() => {
    const ctx = document.getElementById("myChart").getContext("2d");
    const ctx2 = document.getElementById("myChart2").getContext("2d");
    var gradientFill = ctx.createLinearGradient(0, 0, 0, 290);
    gradientFill.addColorStop(0, "rgb(255,181,10)");
    gradientFill.addColorStop(1, "rgb(255,228,167)");
    let values = [];
    let dates = [];
    let myChart;
    let myChart2;
    graphValues = [];

    $socket.on("influxDB", async (arg) => {
      rerender++;
      values = [];
      dates = [];
      arg.flux.dates.map((val) => {
        if (JSON.parse(arg.fridgeValues).fridgeSet != val._value) {
          values.push(val._value);
          dates.push(
            `${
              val._time.split("-")[1] +
              "/" +
              val._time.split("-")[2].split("T")[0]
            }H${val._time.split("T")[1].split(":")[0]}`
          );
        }
      });

      graphValues["values"] = values;
      graphValues["dates"] = dates;
      graphValues["energy"] = arg.flux.energy;
      graphValues["days"] = arg.days;
      let energyData = [];

      if (graphValues.values != undefined) {
        energyData = [];
        graphValues.energy.map((value) => {
          energyData[value["_value"]] && energyData[value["_value"]] > -1
            ? (energyData[value["_value"]] = energyData[value["_value"]] + 1)
            : (energyData[value["_value"]] = 1);
        });
      }

      if (myChart != null) {
        myChart.destroy();
      }
      if (myChart2 != null) {
        myChart2.destroy();
      }

      Chart.register(...registerables);
      myChart = new Chart(ctx, {
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
          animations: {
            tension: {
              duration: 1000,
              easing: "linear",
              from: 1,
              to: 0,
              loop: true,
            },
          },
          plugins: {
            legend: {
              display: false,
              labels: {
                color: "rgb(255, 99, 132)",
              },
            },
          },
          scales: {
            y: {
              grid: {
                gridLines: false,
                display: false,
                drawBorder: false,
              },
            },

            x: {
              grid: {
                gridLines: false,
                display: false,
                drawBorder: false,
              },
              lineWidth: 0,
            },
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
      myChart2 = new Chart(ctx2, {
        display: false,
        type: "bar",
        data: {
          labels: [
            "IDLE",
            //"STATE_OFF",
            //"DOOR_OPEN",
            "HEATING",
            "COOLING",
            "WAITING_TO_COOL",
            //"WAITING_TO_HEAT",
            //"WAITING_FOR_PEAK_DETECT",
            //"COOLING_MIN_TIME",
            //"HEATING_MIN_TIME",
          ],
          datasets: [
            {
              label: ["HEATING"],
              data: [
                energyData[0],
                energyData[3],
                energyData[4],
                energyData[5],
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(201, 203, 207, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 205, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
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
          animations: {
            tension: {
              duration: 1000,
              easing: "linear",
              from: 1,
              to: 0,
              loop: true,
            },
          },
          plugins: {
            legend: {
              display: false,
              labels: {
                color: "rgb(255, 99, 132)",
              },
            },
          },
          scales: {
            y: {
              grid: {
                gridLines: false,
                display: false,
                drawBorder: false,
              },
            },

            x: {
              grid: {
                gridLines: false,
                display: false,
                drawBorder: false,
              },
              lineWidth: 0,
            },
          },
          tooltips: {
            enabled: false,
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
    });
  });
</script>

<main>
  <div class="left">
    <h1>Temperature</h1>
    <h3>
      Last {graphValues && graphValues.days ? graphValues.days : 7} days
    </h3>
    <!-- {#key rerender} -->
    <canvas bind:this={rerender} id="myChart" />
    <!-- {/key} -->
  </div>
  <div class="right">
    <h1>Energy Consumption</h1>
    <h3>
      Last {graphValues != undefined && graphValues.days != undefined
        ? graphValues.days
        : 7} days, 30 second intervals
    </h3>
    <!-- {#key rerender} -->
    <canvas id="myChart2" />
    <!-- {/key} -->
  </div>
</main>

<style>
  h1,
  h3 {
    width: 100%;
    text-align: center;
  }
  canvas {
    padding: 10px;
    border-radius: 10px;
    box-shadow: 6px 10px 30px #cbcbe5;
    margin: 0 7% 12%;
    height: 800px;
  }
  @media (min-width: 900px) {
    div {
      position: absolute;
      display: inline;
      max-width: 38%;
      max-height: 800px;
    }
    .left {
      left: 10%;
      width: 50%;
    }
    .right {
      right: 10%;
      width: 50%;
    }
    #myChart {
      position: relative;
      display: none;
    }
    #myChart2 {
      position: relative;
      display: none;
    }
  }
  @media (max-width: 900px) {
    .right {
      margin-top: 20px;
      padding-bottom: 80px;
    }
  }
</style>
