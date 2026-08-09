import "./style.css";
import * as THREE from "three";
import { GLTFLoader, FlyControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2
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

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide
    }));
plane.rotation.x = Math.PI / 2
scene.add(plane)

const pfpTexture = new THREE.TextureLoader().load("pfp.png")
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ map: pfpTexture })
);
cube.scale.setScalar(0.5)
cube.position.y = 2.5;
cube.position.z = -2;
scene.add(cube);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.2, 20, 50),
    new THREE.MeshBasicMaterial({
        color: 0xff6347,
        wireframe: true
    })
)
torus.position.y = 2.5;
torus.position.z = -2;
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 5, 0);
pointLight.intensity = 100

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
ambientLight.intensity = 2


function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 25, 25);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

const milkywayTexture = new THREE.TextureLoader().load("milkyway.jpg");
milkywayTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = milkywayTexture;

const loader = new GLTFLoader();

const chairModel = loader.load("chair.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(0.125);
    model.position.y = 0.1;
    model.position.z = -3.5;
    model.rotation.y = Math.PI / 2
    scene.add(model);
});

const tableModel = loader.load("table.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(0.2);
    model.position.y = 0.01;
    model.position.z = -2;
    model.rotation.y = Math.PI / 2
    scene.add(model);
});

const stairsModel = loader.load("stairs.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(0.4);
    model.position.x = -4;
    model.position.y = 0.01;
    model.position.z = 4;
    scene.add(model);
});

const flyControls = new FlyControls(camera, renderer.domElement);

flyControls.movementSpeed = 10;
flyControls.rollSpeed = 1;
flyControls.autoForward = false;
flyControls.dragToLook = false;

const timer = new THREE.Timer();

function animate(time) {
    cube.rotation.z = time / 2000;
    cube.rotation.y = time / 1000;
    torus.rotation.x = time / 500;
    torus.rotation.y = time / 250;

    timer.update();
    const delta = timer.getDelta();

    flyControls.update(delta);
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);