// Import Three.js
import * as THREE from "three";

// Scene setup
const scene = new THREE.Scene();
// Make scene background transparent
scene.background = null;

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 1.2);

// Renderer setup with alpha for transparency
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.enableZoom = true;
// controls.autoRotate = false; // We'll handle rotation manually

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add a second light source from the opposite direction for better illumination
const secondLight = new THREE.DirectionalLight(0xffffff, 0.5);
secondLight.position.set(-1, -1, -1);
scene.add(secondLight);

// VHS box dimensions - based on Hellraiser VHS box
const width = 0.577; // Width of front/back face (horizontal)
const height = 1.0; // Height of the box (vertical)
const depth = 0.126; // Width of the spine
const insetDepth = 0.02; // How much the inner black box recesses

// Create the outer sleeve box
function createVHSBox() {
  // Create a texture loader
  const textureLoader = new THREE.TextureLoader();

  // Load the three separate textures
  const front = textureLoader.load("./front.png");
  const spine = textureLoader.load("./spine.png");
  const back = textureLoader.load("./back.png");

  // Set color space for all textures
  [front, spine, back].forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
  });

  // Create a BoxGeometry for the sleeve
  const sleeveGeometry = new THREE.BoxGeometry(width, height, depth);

  // Create materials for each face of the box
  const sleeveMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x000000 }), // Right side (x+)
    new THREE.MeshStandardMaterial({ map: spine }), // Left side (x-)
    new THREE.MeshStandardMaterial({ color: 0x000000 }), // Top (y+)
    new THREE.MeshStandardMaterial({ color: 0x000000 }), // Bottom (y-)
    new THREE.MeshStandardMaterial({ map: front }), // Front (z+)
    new THREE.MeshStandardMaterial({ map: back }), // Back (z-)
  ];

  // Create mesh for the sleeve
  const sleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterials);

  // Create the inner box (slightly smaller, black)
  const innerWidth = width - insetDepth * 2;
  const innerHeight = height - insetDepth * 2;
  const innerDepth = depth - insetDepth * 2;

  const innerGeometry = new THREE.BoxGeometry(
    innerWidth,
    innerHeight,
    innerDepth
  );
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.8,
    metalness: 0.2,
  });

  const innerBox = new THREE.Mesh(innerGeometry, innerMaterial);

  // Create a group to hold both parts
  const vhsBox = new THREE.Group();
  vhsBox.add(sleeve);
  vhsBox.add(innerBox);

  // Center the group in the scene
  vhsBox.position.set(0, 0, 0);

  return vhsBox;
}

// Create the VHS box and add to scene
const vhsBox = createVHSBox();
scene.add(vhsBox);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the VHS box around its vertical axis (y-axis)
  vhsBox.rotation.y += 0.005; // Adjust speed as needed

  //   controls.update();
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
