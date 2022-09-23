import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Define scene and camera
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Setup Renderer and Camera
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg") as HTMLInputElement,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create Torus Shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Add lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// Add visual helpers
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper);

// Add Mouse Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Render 200 stars in random positions
const addStar = () => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill(0)
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
};

Array(200).fill(0).forEach(addStar);

// Add Avatar Shape
const avatarTexture = new THREE.TextureLoader().load("/src/assets/avatar.jpg");
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);

scene.add(avatar);

// Add Moon Shape
const moonTexture = new THREE.TextureLoader().load("/src/assets/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("/src/assets/normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.x = -30;

// Load background
const bgTexture = new THREE.TextureLoader().load("/src/assets/background.jpg");
scene.background = bgTexture;

// Scroll Animations
const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
};

document.body.onscroll = moveCamera;

// Animation Loop
const animate = () => {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update;

  renderer.render(scene, camera);
};

animate();
