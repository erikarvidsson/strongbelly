<script>
  import { socket } from "../store.js";

  let newSetTemp = "";
  let statsDays = "";
  let fridgeValues = { fridgeTemp: "connecting", fridgeSet: "connecting" };

  $socket.on("connect", () => {
    if ($socket.connected) {
      console.log("Socket is connected");
    }
  });

  $socket.on("fridge", (arg) => {
    if (!!JSON.parse(arg).fridgeTemp) {
      fridgeValues = JSON.parse(arg);
    } else {
      console.log("Somthing wrong with mqtt data response");
    }
  });

  async function setNewTempValue(e) {
    try {
      await fetch(`/mqtt?temp=${newSetTemp}`);
    } catch (error) {
      console.error(error);
    }
  }
  async function setNewDaysValue(e) {
    $socket.emit("statsDays", statsDays);
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
  <div class="time">
    <div class="temp">Time span</div>
    <input type="number" placeholder="Days to charts" bind:value={statsDays} />
    <button on:click={setNewDaysValue}>Send</button>
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
