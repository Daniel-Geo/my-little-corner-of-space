import "./style.css";
import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(1, 1, 1);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const flyControls = new FlyControls(camera, renderer.domElement);

flyControls.movementSpeed = 10;
flyControls.rollSpeed = 1;
flyControls.autoForward = false;
flyControls.dragToLook = false;

const timer = new THREE.Timer();

function animate(time) {
    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;

    timer.update();
    const delta = timer.getDelta()

    flyControls.update(delta);
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);