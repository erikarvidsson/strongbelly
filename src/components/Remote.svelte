<script>
  import { io } from "socket.io-client";

  let newSetTemp = "";
  let fridgeValues = { fridgeTemp: "connecting", fridgeSet: "connecting" };

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

  async function setNewTempValue(e) {
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
