<script>
    let searchTerm = "";
    let returnTemp = "";
  
    async function searchForGif(e) {
      try {
        const returnValue = await fetch(`/mqtt?temp=${searchTerm}`);
        const response = await returnValue.json();
  
        console.log(returnValue)
        console.log(response)
        returnTemp = response.data;
      } catch (error) {
        console.error(error);
      }
    }
  </script>
  
  <main>
    <div class="search-block">
      <input
        type="text"
        placeholder="Send temp to fridge"
        bind:value={searchTerm}
      />
      <button on:click={searchForGif}>Send</button>
  
      <div>{returnTemp}</div>
    </div>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
    }
  
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
  
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>
  