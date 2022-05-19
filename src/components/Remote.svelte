<script>
  import { io } from "socket.io-client";
  import { setContext } from "svelte";
  import { graphValues } from "../store.js";

  let newSetTemp = "";
  let fridgeValues = { fridgeTemp: "connecting", fridgeSet: "connecting" };
  let values = [];
  let dates = [];

  const socket = io();

  socket.on("connect", () => {
    if (socket.connected) {
      console.log("Socket is connected");
    }
  });

  socket.on("fridge", (arg) => {
    if (!!JSON.parse(arg).fridgeTemp) {
      fridgeValues = JSON.parse(arg);
    } else {
      console.log("Somthing wrong with mqtt data response");
    }
  });
  socket.on("influxDB", (arg) => {
    values = [];
    dates = [];
    arg.map((val) => {
      if (fridgeValues.fridgeSet != val._value) {
        values.push(val._value);
        // dates.push(val._time);
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
  });

  async function setNewTempValue(e) {
    try {
      await fetch(`/mqtt?temp=${newSetTemp}`);
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
      type="number"
      placeholder="Send temp to fridge"
      bind:value={newSetTemp}
    />
    <button on:click={setNewTempValue}>Send</button>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  .temp {
    margin: 0 0 4px;
  }
  .temp:nth-of-type(2) {
    margin: 0 0 10px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
