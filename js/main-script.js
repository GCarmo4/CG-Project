//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var cameras = [];

var lights = [];

var materials = [];

var clock;
var stats;

var robot, head, leftArm, rigthArm, legs, foot, trailer;

const headWidth = 8, headHeight = 8, headDepth = 8;
const antennaWidth = 1, antennaHeight = 6, antennaDepth = 2;
const pipeRadius = 1, pipeHeight = 22;
const eyeWidth = 2, eyeHeight = 1, eyeDepth = 1;
const armWidth = 6, armHeight = 16, armDepth = 8;
const forearmWidth = armWidth, forearmHeight = 6, forearmDepth = 24;
const torsoWidth = 24, torsoHeight = 16, torsoDepth = 24;
const abdomenWidth = 12, abdomenHeight = 14, abdomenDepth = torsoDepth;
const waistWidth = torsoWidth, waistHeight = 4, waistDepth = 1;
const wheelRadius = 5, wheelHeight = 5;
const thighWidth = 4, thighHeight = 13, thighDepth = 4;
const legWidth = 6, legHeight = 30, legDepth = 6;
const footWidth = legWidth, footHeight = legDepth, footDepth = 14;
const sidefootWidth = wheelHeight, sidefootHeight = footHeight, sidefootDepth = 4;

const containerWidth = 24, containerHeight = 32, containerDepth = 72;
const deckWidth = containerWidth - 2 * wheelHeight, deckHeight = 8, deckDepth = 4 * wheelRadius + 6;
const linkerWidth = 8, linkerHeight = deckHeight, linkerDepth = 16;

const offset = 0.1; // offset to avoid overlapping

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    scene.add(new THREE.AxesHelper(30)); // to remove
    
    createMaterials();

    createRobot();

    createTrailer();
}

function createMaterials() {
    'use strict';

    materials.push(new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: false }));

    materials.push(new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false }));

    materials.push(new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: false }));

    materials.push(new THREE.MeshPhongMaterial({ color: 0x0000ff, wireframe: false }));

    materials.push(new THREE.MeshPhongMaterial({ color: 0x808080, wireframe: false }));
}

function createGUI() {
    'use strict';

    var gui = new dat.GUI();
    
    // Lights GUI folder

    var ligthsFolder = gui.addFolder( 'Lights' );

    var ambientFolder = ligthsFolder.addFolder( 'Ambient Light');
    ambientFolder.add(lights[0], 'intensity', 0, 1);

    var directionalFolder = ligthsFolder.addFolder( 'Directional Light');
    directionalFolder.add(lights[1], 'intensity', 0, 1);
    directionalFolder.add(lights[1].position, 'x', -30, 30);
    directionalFolder.add(lights[1].position, 'y', -30, 30);

    // Cameras GUI folder

    var camerasFolder = gui.addFolder( 'Cameras' );

    var frontFolder = camerasFolder.addFolder( 'Front Camera');
    frontFolder.add(cameras[0], 'zoom', 3, 8).onChange(function (value) {cameras[0].updateProjectionMatrix();});

    var sideFolder = camerasFolder.addFolder( 'Side Camera');
    sideFolder.add(cameras[1], 'zoom', 3, 8).onChange(function (value) {cameras[1].updateProjectionMatrix();});

    var topFolder = camerasFolder.addFolder( 'Top Camera');
    topFolder.add(cameras[2], 'zoom', 3, 8).onChange(function (value) {cameras[2].updateProjectionMatrix();});

    var isometricFolder = camerasFolder.addFolder( 'Isometric Orthographic Camera');
    isometricFolder.add(cameras[3], 'zoom', 3, 6).onChange(function (value) {cameras[3].updateProjectionMatrix();});
    isometricFolder.add(cameras[3].position, 'x', 0, 50).onChange(function (value) {cameras[3].lookAt(scene.position);});
    isometricFolder.add(cameras[3].position, 'y', 0, 50).onChange(function (value) {cameras[3].lookAt(scene.position);});
    isometricFolder.add(cameras[3].position, 'z', 0, 50).onChange(function (value) {cameras[3].lookAt(scene.position);});

    // Robot GUI folder

    var robotFolder = gui.addFolder( 'Robot' );
    
    var headFolder = robotFolder.addFolder("Head");
    headFolder.add(head.rotation, 'x', 0, Math.PI).listen();

    var legFolder = robotFolder.addFolder("Leg");
    legFolder.add(legs.rotation, 'x', 0, Math.PI / 2).listen();

    var armFolder = robotFolder.addFolder("Arm");
    armFolder.add(rigthArm.position, 'x', torsoWidth / 2 - armWidth / 2, torsoWidth / 2 + armWidth / 2).listen();
    armFolder.add(leftArm.position, 'x', - torsoWidth / 2 - armWidth / 2, - torsoWidth / 2 + armWidth / 2).listen();

    var footFolder = robotFolder.addFolder("Foot");
    footFolder.add(foot.rotation, 'x', 0, Math.PI / 2).listen();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';

    createFrontCamera(); 

    createSideCamera();

    createTopCamera();

    createIsometricCamera();

    createPrespectiveCamera();
}

function createFrontCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    camera.position.set(0, 0, 75);
    camera.zoom = 4;
    camera.updateProjectionMatrix();
    cameras.push(camera);
}

function createSideCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    camera.position.set(75, 0, 0);
    camera.rotation.y = Math.PI / 2;
    camera.zoom = 4;
    camera.updateProjectionMatrix();
    cameras.push(camera);
}

function createTopCamera() { 
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    camera.position.set(0, 75, 0);
    camera.rotation.x = - Math.PI / 2;
    camera.zoom = 4;
    camera.updateProjectionMatrix();
    cameras.push(camera);
}

function createIsometricCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    camera.position.set(75, 75, 75);
    camera.lookAt(scene.position);
    camera.zoom = 4;
    camera.updateProjectionMatrix();
    cameras.push(camera);    
}

function createPrespectiveCamera() {
    'use strict';

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(70, 75, 75);
    camera.lookAt(scene.position);

    // Orbit Controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
	controls.maxDistance = 1000;
    // controls.update() must be called after any manual changes to the camera's transform

    cameras.push(camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';

    lights.push(new THREE.AmbientLight(0xFFFFFF, 0.5));
    scene.add(lights[0]);

    lights.push(new THREE.DirectionalLight(0xFFFFFF, 1));
    lights[1].position.set(10, 20, 40);
    scene.add(lights[1]);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createRobot() {
    'use strict';

    head = new THREE.Object3D();
    head.userData = { positive: 0, negative: 0 };
    createHead(head);
    head.position.set(0, abdomenHeight + torsoHeight - offset, 0);

    leftArm = new THREE.Object3D();
    leftArm.userData = { positive: 0, negative: 0 };
    createLeftArm(leftArm);
    leftArm.position.set(- torsoWidth / 2 - armWidth / 2, abdomenHeight + torsoHeight, - torsoDepth / 2 + armDepth / 2);

    rigthArm = new THREE.Object3D();
    rigthArm.userData = { positive: 0, negative: 0 };
    createRigthArm(rigthArm);
    rigthArm.position.set(torsoWidth / 2 + armWidth / 2, abdomenHeight + torsoHeight, - torsoDepth / 2 + armDepth / 2);

    foot = new THREE.Object3D();
    foot.userData = { positive: 0, negative: 0 };
    createFoot(foot);
    foot.position.set(0, - thighHeight - legHeight + footHeight / 2, 0);

    legs = new THREE.Object3D();
    legs.userData = { positive: 0, negative: 0 };
    createThigh(legs);
    createLeg(legs);
    legs.add(foot);
    legs.position.set(0, legDepth / 2,  thighHeight - abdomenDepth / 2);

    robot = new THREE.Object3D();
    robot.userData = { min: new THREE.Vector3(- torsoWidth / 2, 0, torsoDepth / 2), max: new THREE.Vector3(torsoWidth / 2, abdomenHeight + torsoHeight, - torsoDepth / 2 - legHeight - footDepth + legDepth) };
    createTorso(robot);
    createAbdomen(robot);
    createWaist(robot);
    robot.add(head);
    robot.add(rigthArm);
    robot.add(leftArm);
    robot.add(legs);
    scene.add(robot);
}

function createHead(head) {
    'use strict';

    var _head = new THREE.Mesh(new THREE.BoxGeometry(headWidth, headHeight, headDepth), materials[3]);
    _head.position.set(0, headHeight / 2 + offset, 0); 
    head.add(_head);

    var leftAntenna = new THREE.Mesh(new THREE.BoxGeometry(antennaWidth, antennaHeight, antennaDepth), materials[3]);
    leftAntenna.position.set(- headWidth / 2 - antennaWidth / 2, headHeight + offset, 0);
    head.add(leftAntenna);

    var rightAntenna = new THREE.Mesh(new THREE.BoxGeometry(antennaWidth, antennaHeight, antennaDepth), materials[3]);
    rightAntenna.position.set(headWidth / 2 + antennaWidth / 2, headHeight + offset, 0);
    head.add(rightAntenna);

    var leftEye = new THREE.Mesh(new THREE.BoxGeometry(eyeWidth, eyeHeight, eyeDepth), materials[1]);
    leftEye.position.set(- headWidth / 4, headHeight / 2 + eyeHeight / 2 + 1 + offset, headDepth / 2 - eyeDepth / 2 + offset);
    head.add(leftEye);

    var rightEye = new THREE.Mesh(new THREE.BoxGeometry(eyeWidth, eyeHeight, eyeDepth), materials[1]);
    rightEye.position.set(headWidth / 4, headHeight / 2 + eyeHeight / 2 + 1 + offset, headDepth / 2 - eyeDepth / 2 + offset);
    head.add(rightEye);    
}

function createLeftArm(leftArm) {
    'use strict';

    var LeftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armDepth), materials[0]);
    LeftUpperArm.position.set(0, - armHeight / 2, 0);
    leftArm.add(LeftUpperArm);

    var leftForearm = new THREE.Mesh(new THREE.BoxGeometry(forearmWidth, forearmHeight, forearmDepth), materials[0]);
    leftForearm.position.set(0, - armHeight - forearmHeight / 2,  torsoDepth / 2 - armDepth / 2);
    leftArm.add(leftForearm);

    var leftPipe = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeHeight, 16), materials[4]);
    leftPipe.position.set(0, - armHeight + pipeHeight / 2, - armDepth / 2 - pipeRadius);
    leftArm.add(leftPipe);
}

function createRigthArm(rigthArm) {
    'use strict';

    var rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armDepth), materials[0]);
    rightUpperArm.position.set(0, - armHeight / 2, 0);
    rigthArm.add(rightUpperArm);

    var rightForearm = new THREE.Mesh(new THREE.BoxGeometry(forearmWidth, forearmHeight, forearmDepth), materials[0]);
    rightForearm.position.set(0, - armHeight - forearmHeight / 2, torsoDepth / 2 - armDepth / 2);
    rigthArm.add(rightForearm);

    var rightPipe = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeHeight, 16), materials[4]);
    rightPipe.position.set(0, - armHeight + pipeHeight / 2, - armDepth / 2 - pipeRadius);
    rigthArm.add(rightPipe);
}

function createFoot(foot) {
    'use strict';

    var leftFoot = new THREE.Mesh(new THREE.BoxGeometry(footWidth, footHeight, footDepth), materials[3]);
    leftFoot.position.set(- abdomenWidth / 2 + thighWidth / 2 + offset , 0, footDepth / 2 - footHeight / 2);
    foot.add(leftFoot);

    var rightFoot = new THREE.Mesh(new THREE.BoxGeometry(footWidth, footHeight, footDepth), materials[3]);
    rightFoot.position.set(abdomenWidth / 2 - thighWidth / 2 - offset, 0, footDepth / 2 - footHeight / 2);
    foot.add(rightFoot);

    var leftSidefoot = new THREE.Mesh(new THREE.BoxGeometry(sidefootWidth, sidefootHeight, sidefootDepth), materials[3]);
    leftSidefoot.position.set(- abdomenWidth / 2 - 1 + offset - sidefootWidth / 2, 0, footDepth - footHeight / 2 - sidefootDepth / 2);
    foot.add(leftSidefoot);

    var rightSidefoot = new THREE.Mesh(new THREE.BoxGeometry(sidefootWidth, sidefootHeight, sidefootDepth), materials[3]);
    rightSidefoot.position.set(abdomenWidth / 2 + 1 - offset + sidefootWidth / 2, 0, footDepth - footHeight / 2 - sidefootDepth / 2);
    foot.add(rightSidefoot);
}

function createThigh(legs) {
    'use strict';

    var leftThigh = new THREE.Mesh(new THREE.BoxGeometry(thighWidth, thighHeight, thighDepth), materials[1]);
    leftThigh.position.set(- abdomenWidth / 2 + thighWidth / 2 + offset, - thighHeight / 2, 0);
    legs.add(leftThigh);

    var rightThigh = new THREE.Mesh(new THREE.BoxGeometry(thighWidth, thighHeight, thighDepth), materials[1]);
    rightThigh.position.set(abdomenWidth / 2 - thighWidth / 2 - offset, - thighHeight / 2 , 0);
    legs.add(rightThigh);
}

function createLeg(legs) {
    'use strict';

    var leftLeg = new THREE.Mesh(new THREE.BoxGeometry(legWidth, legHeight, legDepth), materials[3]);
    leftLeg.position.set(- abdomenWidth / 2 + thighWidth / 2 + offset, - thighHeight - legHeight / 2, 0);
    legs.add(leftLeg);

    var rightLeg = new THREE.Mesh(new THREE.BoxGeometry(legWidth, legHeight, legDepth), materials[3]);
    rightLeg.position.set(abdomenWidth / 2 - thighWidth / 2 - offset, - thighHeight - legHeight / 2, 0);
    legs.add(rightLeg);

    var leftLegLowerWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    leftLegLowerWheel.rotation.z = Math.PI / 2;
    leftLegLowerWheel.position.set(- abdomenWidth / 2 - 1 - wheelHeight / 2 + offset, - thighHeight - legHeight + wheelRadius + 1, legDepth / 2 - waistHeight / 2);
    legs.add(leftLegLowerWheel);

    var rightLegLowerWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    rightLegLowerWheel.rotation.z = Math.PI / 2;
    rightLegLowerWheel.position.set(abdomenWidth / 2 + 1 + wheelHeight / 2 - offset, - thighHeight - legHeight + wheelRadius + 1, legDepth / 2 - waistHeight / 2);
    legs.add(rightLegLowerWheel);

    var leftLegUpperWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    leftLegUpperWheel.rotation.z = Math.PI / 2;
    leftLegUpperWheel.position.set(- abdomenWidth / 2 - 1 - wheelHeight / 2 + offset, - thighHeight - (legHeight - footHeight) / 2, legDepth / 2 - waistHeight / 2);
    legs.add(leftLegUpperWheel);

    var rightLegUpperWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    rightLegUpperWheel.rotation.z = Math.PI / 2;
    rightLegUpperWheel.position.set(abdomenWidth / 2 + 1 + wheelHeight / 2 - offset, - thighHeight - (legHeight - footHeight) / 2, legDepth / 2 - waistHeight / 2);
    legs.add(rightLegUpperWheel);
}

function createTorso(robot) {
    'use strict';

    var torso = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth, torsoHeight, torsoDepth), materials[0]);
    torso.position.set(0, abdomenHeight + torsoHeight / 2, 0);
    robot.add(torso);
}

function createAbdomen(robot) {
    'use strict';

    var abdomen = new THREE.Mesh(new THREE.BoxGeometry(abdomenWidth, abdomenHeight, abdomenDepth), materials[0]);
    abdomen.position.set(0, abdomenHeight / 2, 0);
    robot.add(abdomen);
}

function createWaist(robot) {
    'use strict';

    var waist = new THREE.Mesh(new THREE.BoxGeometry(waistWidth, waistHeight, waistDepth), materials[1]);
    waist.position.set(0, waistHeight / 2, torsoDepth / 2 + waistDepth / 2);
    robot.add(waist);

    var leftWaistWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    leftWaistWheel.rotation.z = Math.PI / 2;
    leftWaistWheel.position.set(- abdomenWidth / 2 - 1 - wheelHeight / 2, waistHeight / 2, abdomenDepth / 6);
    robot.add(leftWaistWheel);

    var rightWaistWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    rightWaistWheel.rotation.z = Math.PI / 2;
    rightWaistWheel.position.set(abdomenWidth / 2 + 1 + wheelHeight / 2, waistHeight / 2, abdomenDepth / 6);
    robot.add(rightWaistWheel);
}

function createTrailer() {
    'use strict';

    trailer = new THREE.Object3D();
    trailer.userData = { xPositive: 0, xNegative: 0, zPositive: 0, zNegative: 0 , min: new THREE.Vector3(- containerWidth / 2, - containerHeight / 2 - deckHeight, containerDepth / 2), max: new THREE.Vector3(containerWidth / 2, containerHeight / 2, - containerDepth / 2) };
    createContainer(trailer);
    trailer.position.set(50, containerHeight / 2 + 1 + wheelRadius + waistHeight / 2 , - 50);72 
    scene.add(trailer);
}

function createContainer(trailer) {
    var container = new THREE.Mesh(new THREE.BoxGeometry(containerWidth, containerHeight, containerDepth), materials[4]);
    trailer.add(container);

    var deck = new THREE.Mesh(new THREE.BoxGeometry(deckWidth, deckHeight, deckDepth), materials[3]);
    deck.position.set(0, - containerHeight / 2 - deckHeight / 2, - containerDepth / 2 + deckDepth / 2);
    trailer.add(deck);

    var linker = new THREE.Mesh(new THREE.BoxGeometry(linkerWidth, linkerHeight, linkerDepth), materials[3]);
    linker.position.set(0, - containerHeight / 2 - linkerHeight / 2, containerDepth / 2 - linkerDepth / 2);
    trailer.add(linker);

    var leftFirstWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    leftFirstWheel.rotation.z = Math.PI / 2;
    leftFirstWheel.position.set(- containerWidth / 2 + wheelHeight / 2, - containerHeight / 2 - 1 - wheelRadius, - containerDepth / 2 + deckDepth - wheelRadius - 1);
    trailer.add(leftFirstWheel);

    var rightFirstWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    rightFirstWheel.rotation.z = Math.PI / 2;
    rightFirstWheel.position.set(containerWidth / 2 - wheelHeight / 2, - containerHeight / 2 - 1 - wheelRadius, - containerDepth / 2 + deckDepth - wheelRadius - 1);
    trailer.add(rightFirstWheel);

    var leftSecondWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    leftSecondWheel.rotation.z = Math.PI / 2;
    leftSecondWheel.position.set(- containerWidth / 2 + wheelHeight / 2, - containerHeight / 2 - 1 - wheelRadius, - containerDepth / 2 + wheelRadius + 1);
    trailer.add(leftSecondWheel);

    var rightSecondWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    rightSecondWheel.rotation.z = Math.PI / 2;
    rightSecondWheel.position.set(containerWidth / 2 - wheelHeight / 2, - containerHeight / 2 - 1 - wheelRadius, - containerDepth / 2 + wheelRadius + 1);
    trailer.add(rightSecondWheel);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

    if (truckMode()) {
        // console.log("truck mode");

        if (hasCollision()) {
            console.log("has collision");
            trailer.position.x = 0;
            trailer.position.z = -58;
        }

    }

}

function truckMode() { 
    'use strict';

    return head.rotation.x == Math.PI && 
        leftArm.position.x == - torsoWidth / 2 + armWidth / 2 && 
        rigthArm.position.x == torsoWidth / 2 - armWidth / 2 && 
        legs.rotation.x == Math.PI / 2 && 
        foot.rotation.x == Math.PI / 2;
}

function hasCollision() {
    'use strict';

    if (robot.userData.max.x <= (trailer.position.x + trailer.userData.min.x)) 
        return false;
    if (robot.userData.min.x >= (trailer.position.x + trailer.userData.max.x))
        return false;
    if (robot.userData.max.y <= (trailer.position.y + trailer.userData.min.y))
        return false;
    if (robot.userData.min.y >= (trailer.position.y + trailer.userData.max.y))
        return false;
    if (robot.userData.max.z >= (trailer.position.z + trailer.userData.min.z))
        return false;
    if (robot.userData.min.z <= (trailer.position.z + trailer.userData.max.z))
        return false;

    return true;
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(delta){
    'use strict';

    trailer.position.x += (trailer.userData.xPositive - trailer.userData.xNegative) * 20 * delta;
    trailer.position.z += (trailer.userData.zPositive - trailer.userData.zNegative) * 20 * delta;
    
    foot.rotation.x = THREE.Math.clamp(foot.rotation.x + (foot.userData.positive - foot.userData.negative) * Math.PI / 2 * delta, 0, Math.PI / 2);

    legs.rotation.x = THREE.Math.clamp(legs.rotation.x + (legs.userData.positive - legs.userData.negative) * Math.PI / 2 * delta, 0, Math.PI / 2);

    head.rotation.x = THREE.Math.clamp(head.rotation.x + (head.userData.positive - head.userData.negative) * Math.PI * delta, 0, Math.PI);

    leftArm.position.x = THREE.Math.clamp(leftArm.position.x + (leftArm.userData.positive - leftArm.userData.negative) * armWidth * delta, - torsoWidth / 2 - armWidth / 2, - torsoWidth / 2 + armWidth / 2);

    rigthArm.position.x = THREE.Math.clamp(rigthArm.position.x + (rigthArm.userData.positive - rigthArm.userData.negative) * armWidth * delta, torsoWidth / 2 - armWidth / 2, torsoWidth / 2 + armWidth / 2);
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild( stats.dom );

    createScene();
    createCameras();
    createLights();
    clock = new THREE.Clock();
    createGUI();
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    var delta = clock.getDelta();
    
    update(delta);
    checkCollisions();
    render();

    stats.update();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    console.log('keydown:' + e.key);

    switch (e.key) {
        case 'ArrowLeft': // left arrow
            trailer.userData.xNegative = 1;
            break;
        case 'ArrowUp': // up arrow
            trailer.userData.zNegative = 1;
            break;
        case 'ArrowRight': // right arrow
            trailer.userData.xPositive = 1;
            break;
        case 'ArrowDown': // down arrow
            trailer.userData.zPositive = 1;
            break;

        case '1': // Frontal Camera
            camera = cameras[0];
            break;
        case '2': // Side Camera
            camera = cameras[1];
            break;
        case '3': // Top Camera
            camera = cameras[2];
            break;
        case '4': // Isometric Orthographic Camera
            camera = cameras[3];
            break;
        case '5': // Isometric Prespective Camera
            camera = cameras[4];
            break;
        case '6': // Toggle Wireframe
            materials.forEach(material => {material.wireframe = !material.wireframe});
            break;

        case 'A': case 'a': // foot in
            foot.userData.positive = 1;
            break;
        case 'D': case 'd': 
            leftArm.userData.positive = 1;
            rigthArm.userData.negative = 1;
            break;
        case 'E': case 'e': // arms out
            leftArm.userData.negative = 1;
            rigthArm.userData.positive = 1;
            break;
        case 'F': case 'f': // head in
            head.userData.positive = 1;
            break;
        case 'Q': case 'q': // foot out
            foot.userData.negative = 1;
            break;
        case 'R': case 'r': // head out
            head.userData.negative = 1;
            break;
        case 'S': case 's': // legs in
            legs.userData.positive = 1;
            break;
        case 'W': case 'w': // legs out
            legs.userData.negative = 1;
            break;    
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    // console.log('keyup:' + e.key);

    switch (e.key) {
        case 'ArrowLeft':
            trailer.userData.xNegative = 0;
            break;
        case 'ArrowUp':
            trailer.userData.zNegative = 0;
            break;
        case 'ArrowRight':
            trailer.userData.xPositive = 0;
            break;
        case 'ArrowDown':
            trailer.userData.zPositive = 0;
            break;

        case 'A': case 'a':
            foot.userData.positive = 0;
            break;
        case 'D': case 'd':
            leftArm.userData.positive = 0;
            rigthArm.userData.negative = 0;
            break;
        case 'E': case 'e':
            leftArm.userData.negative = 0;
            rigthArm.userData.positive = 0;
            break;
        case 'F': case 'f': 
            head.userData.positive = 0;
            break;
        case 'Q': case 'q': 
            foot.userData.negative = 0;
            break;
        case 'R': case 'r':
            head.userData.negative = 0;
            break;
        case 'S': case 's': 
            legs.userData.positive = 0;
            break;
        case 'W': case 'w':
            legs.userData.negative = 0;
            break;
    }

}