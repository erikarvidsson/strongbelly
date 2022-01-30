<script>
  import "@google/model-viewer";
</script>

<div class="container">
  <model-viewer
    class="viewer"
    bounds="tight"
    src="./soda_can/scene.gltf"
    camera-controls
    auto-rotate
    shadow-intensity="1"
  >
    <div class="progress-bar hide" slot="progress-bar">
      <div class="update-bar" />
    </div>
    <button slot="ar-button" id="ar-button"> View in your space </button>
  </model-viewer>
</div>

<style>
  .container {
    width: 100%;
    height: fit-content;
  }
  .viewer {
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
