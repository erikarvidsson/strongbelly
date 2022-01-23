<script>
  import { onMount } from "svelte";
  import { createScene } from "../sceene.svelte";

  let el;
  onMount(() => {
    createScene(el);
  });
</script>

<canvas bind:this={el} />

<style>

</style>
