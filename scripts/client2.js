// Art 109 Three.js Demo Site
// client7.js
// A three.js scene which uses planes and texture loading to generate a scene with images which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core
import * as THREE from "../build/three.module.js";
// Import pointer lock controls
import {
  PointerLockControls
} from "../src/PointerLockControls.js";

import {
  GLTFLoader
} from "../src/GLTFLoader.js";

// Establish variables
let camera, scene, renderer, controls, material;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  // Define scene lighting
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);


  // 1 Image (red and purple glitch map)
  // Load image as texture
  const texture = new THREE.TextureLoader().load( './assets/app.png' );
  // Immediately use the texture for material creation
  const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry = new THREE.PlaneGeometry( 20, 20 );
  // Apply image texture to plane geometry
  const plane = new THREE.Mesh( geometry, material );
  // Position plane geometry
  plane.position.set(0 , 50 , -40);
  // Place plane geometry
  scene.add( plane );

  // 2 Image (Text with image and white background)
  // Load image as texture
  const texture2 = new THREE.TextureLoader().load( './assets/appp.png' );
  // immediately use the texture for material creation
  const material2 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry2 = new THREE.PlaneGeometry( 20, 20 );
  // Apply image texture to plane geometry
  const plane2 = new THREE.Mesh( geometry2, material2 );
  // Position plane geometry
  plane2.position.set(0 , 50 , -41);
  // Place plane geometry
  scene.add( plane2 );

  // 3 Image (Text with image and white background)
  // Load image as texture
  const texture3 = new THREE.TextureLoader().load( './assets/bo.PNG' );
  // immediately use the texture for material creation
  const material3 = new THREE.MeshBasicMaterial( { map: texture3, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry3 = new THREE.PlaneGeometry( 30, 30 );
  // Apply image texture to plane geometry
  const plane3 = new THREE.Mesh( geometry3, material3 );
  // Position plane geometry
  plane3.position.set(-50 , 40 , -65);
  // Place plane geometry
  scene.add( plane3 );

  // 4 Image (Text with image and white background)
  // Load image as texture
  const texture4 = new THREE.TextureLoader().load( './assets/derekh.png' );
  // immediately use the texture for material creation
  const material4 = new THREE.MeshBasicMaterial( { map: texture4, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry4 = new THREE.PlaneGeometry( 30, 30 );
  // Apply image texture to plane geometry
  const plane4 = new THREE.Mesh( geometry4, material4 );
  // Position plane geometry
  plane4.position.set(-50 , 40 , -66);
  // Place plane geometry
  scene.add( plane4 );

  // 5 Image (Text with image and white background)
  // Load image as texture
  const texture5 = new THREE.TextureLoader().load( './assets/me.png' );
  // immediately use the texture for material creation
  const material5 = new THREE.MeshBasicMaterial( { map: texture5, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry5 = new THREE.PlaneGeometry( 35, 35 );
  // Apply image texture to plane geometry
  const plane5 = new THREE.Mesh( geometry5, material5 );
  // Position plane geometry
  plane5.position.set(50 , 60 , -70);
  // Place plane geometry
  scene.add( plane5 );

  // 6 Image (Text with image and white background)
  // Load image as texture
  const texture6 = new THREE.TextureLoader().load( './assets/meme.png' );
  // immediately use the texture for material creation
  const material6 = new THREE.MeshBasicMaterial( { map: texture6, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry6 = new THREE.PlaneGeometry( 35, 35 );
  // Apply image texture to plane geometry
  const plane6 = new THREE.Mesh( geometry6, material6 );
  // Position plane geometry
  plane6.position.set(50 , 60 , -71);
  // Place plane geometry
  scene.add( plane6 );

  // 7 Image (Text with image and white background)
  // Load image as texture
  const texture7 = new THREE.TextureLoader().load( './assets/tt.png' );
  // immediately use the texture for material creation
  const material7 = new THREE.MeshBasicMaterial( { map: texture7, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry7 = new THREE.PlaneGeometry( 40, 40 );
  // Apply image texture to plane geometry
  const plane7 = new THREE.Mesh( geometry7, material7 );
  // Position plane geometry
  plane7.position.set(-65 , 90 , -90);
  // Place plane geometry
  scene.add( plane7 );

  // 8 Image (Text with image and white background)
  // Load image as texture
  const texture8 = new THREE.TextureLoader().load( './assets/ttc.png' );
  // immediately use the texture for material creation
  const material8 = new THREE.MeshBasicMaterial( { map: texture8, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry8 = new THREE.PlaneGeometry( 40, 40 );
  // Apply image texture to plane geometry
  const plane8 = new THREE.Mesh( geometry8, material8 );
  // Position plane geometry
  plane8.position.set(-65 , 90 , -91);
  // Place plane geometry
  scene.add( plane8 );

  // 9 Image (Text with image and white background)
  // Load image as texture
  const texture9 = new THREE.TextureLoader().load( './assets/video.PNG' );
  // immediately use the texture for material creation
  const material9 = new THREE.MeshBasicMaterial( { map: texture9, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry9 = new THREE.PlaneGeometry( 10, 10 );
  // Apply image texture to plane geometry
  const plane9 = new THREE.Mesh( geometry9, material9 );
  // Position plane geometry
  plane9.position.set(-5 , 18 , -20);
  // Place plane geometry
  scene.add( plane9 );

  // 10 Image (Text with image and white background)
  // Load image as texture
  const texture10 = new THREE.TextureLoader().load( './assets/cu.png' );
  // immediately use the texture for material creation
  const material10 = new THREE.MeshBasicMaterial( { map: texture10, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry10 = new THREE.PlaneGeometry( 5, 5 );
  // Apply image texture to plane geometry
  const plane10 = new THREE.Mesh( geometry10, material10 );
  // Position plane geometry
  plane10.position.set(6 , 13 , -10);
  // Place plane geometry
  scene.add( plane10 );

  // 11 Image (Text with image and white background)
  // Load image as texture
  const texture11 = new THREE.TextureLoader().load( './assets/bg.png' );
  // immediately use the texture for material creation
  const material11 = new THREE.MeshBasicMaterial( { map: texture11, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry11 = new THREE.PlaneGeometry( 460, 190 );
  // Apply image texture to plane geometry
  const plane11 = new THREE.Mesh( geometry11, material11 );
  // Position plane geometry
  plane11.position.set(0 , 138 , -150);
  // Place plane geometry
  scene.add( plane11 );

  // Adding 3D model---------------------------------------------------------
      var mesh;
      // Load preanimated model, add material, and add it to the scene
      const loader = new GLTFLoader().load(
          "assets/pc.glb",
          function (gltf) {
              gltf.scene.traverse(function (child) {
                  if (child.isMesh) {
                      // child.material = newMaterial;
                  }
              });
              // set position and scale
              mesh = gltf.scene;
              mesh.position.set(0, 6, -80);
              mesh.rotation.set(0, 1.57, 0);
              mesh.scale.set(10, 10, 15);
              // Add model to scene
              scene.add(mesh);

          },
          undefined,
          function (error) {
              console.error(error);
          }
      );



  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}
