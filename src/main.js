import "./style.css";
import * as THREE from "three";
import { GLTFLoader, TTFLoader, FontLoader, TextGeometry, FlyControls} from "three/examples/jsm/Addons.js";

const base = import.meta.env.BASE_URL

const scene = new THREE.Scene();
const listener = new THREE.AudioListener();
const backgroundMusic = new THREE.Audio(listener);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2;
camera.position.z = 5;
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load(`${base}music/bg-music.mp3`, (buffer) => {
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true);
    backgroundMusic.play();
});

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

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
plane.receiveShadow = true;
scene.add(plane)

const pfpTexture = new THREE.TextureLoader().load(`${base}images/pfp.png`);
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ map: pfpTexture })
);
cube.scale.setScalar(0.5);
cube.position.y = 2.5;
cube.position.z = -2;
cube.castShadow = true;
cube.receiveShadow = true;
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
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true;
pointLight.intensity = 100;

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
ambientLight.intensity = 2;


function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 25, 25);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

const milkywayTexture = new THREE.TextureLoader().load(`${base}images/milkyway.jpg`);
milkywayTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = milkywayTexture;

const loader = new GLTFLoader();

const chairModel = loader.load(`${base}models/chair.glb`, (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(0.125);
    model.position.y = 0.1;
    model.position.z = -3.5;
    model.rotation.y = Math.PI / 2;
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
    scene.add(model);
});

const tableModel = loader.load(`${base}models/table.glb`, (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(0.2);
    model.position.y = 0.01;
    model.position.z = -2;
    model.rotation.y = Math.PI / 2;
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
    scene.add(model);
});

const stairsModel = loader.load(`${base}models/stairs.glb`, (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(0.4);
    model.position.x = -4;
    model.position.y = 0.01;
    model.position.z = 4;
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
        }
    })
    scene.add(model);
});

const ttfLoader = new TTFLoader();
ttfLoader.load(`${base}fonts/sekuya-regular-font.ttf`, (jsonFontData) => {
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(jsonFontData);

    const textGeometry = new TextGeometry("made with love by Daniel-Geo", {
        font: font,
        size: 0.1,
        depth: 0.02,
        curveSegments: 20,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.001,
        bevelSegments: 5
    });

    const textMaterial = [
        new THREE.MeshPhongMaterial({ color: 0xffff00 }),
        new THREE.MeshPhongMaterial({ color: 0xff6347 })
    ];

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = -1.75;
    textMesh.position.y = 1.5;
    textMesh.position.z = -2;
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;
    scene.add(textMesh);
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

function unlockAudio() {
    if (listener.context.state === "suspended") {
        listener.context.resume();
    }
    if (!backgroundMusic.isPlaying && backgroundMusic.buffer) {
        backgroundMusic.play();
    }
}

["click", "keydown", "touchstart"].forEach((event) => {
    window.addEventListener(event, unlockAudio, { once: true });
});