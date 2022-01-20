<script context="module">
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

  const loader = new GLTFLoader();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  let renderer;
  scene.add(camera);
  scene.add(cube);
  camera.position.z = 5;
  camera.position.z = 5;

  const loadedData = loader.load(
    // resource URL
    "/static/soda_can/scene.gltf",
    // called when the resource is loaded
    function (gltf) {
      scene.add(gltf.scene);

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log(error)
      console.log("An error happened");
    }
  );

  const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  };

  const resize = () => {
    renderer.setSize(1000, 1000);
    camera.aspect = 1000 / 1000;
    camera.updateProjectionMatrix();
  };

  export const createScene = (el) => {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: el,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    resize();
    animate();
  };

  window.addEventListener("resize", resize);
</script>
