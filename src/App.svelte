<script>
  import Remote from "./components/Remote.svelte";
  import Chart from "./components/Chart.svelte";
  import InfluxGraph from "./components/InfluxGraph.svelte";
  import ModelBottle from "./components/ModelBottle.svelte";
</script>

<main>
  <h1>StrongBelly</h1>
  <ModelBottle />
  <Remote />
  <InfluxGraph />
  <Chart />
</main>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    width: 100%;
    text-align: center;
  }
</style>
