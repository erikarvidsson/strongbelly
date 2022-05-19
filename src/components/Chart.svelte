<script>
  import { Chart, registerables } from "chart.js";
  import { graphValues } from "../store.js";
  import { onMount, getContext } from "svelte";

  onMount(() => {
    const ctx = document.getElementById("myChart").getContext("2d");
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

    let chartInterval = setInterval(() => {
      if (graphValues.values != undefined) {
        myChart.data.datasets[0].data = [...graphValues.values];
        myChart.data.labels = graphValues.dates;
        myChart.update();
        clearInterval(chartInterval);
      }
    }, 5000);
  });
</script>

<main>
  <canvas id="myChart" width="800" height="400" />
</main>
