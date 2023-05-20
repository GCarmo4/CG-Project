//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var cameras = [];

var materials = [];

var controls;

var robot;
var headSet, head, leftAntenna, rightAntenna;
var leftArmSet, rigthArmSet, leftArm, rightArm, leftForearm, rightForearm;
var torso, abdomen, waist, leftWaistWheel, rightWaistWheel;
var legSet, rightThigh, leftThigh, rightLeg, leftLeg, upperLeftLegWheel, lowerLeftLegWheel, uppperRightLegWheel, lowerRightLegWheel;
var footSet, rightFoot, leftFoot, rightSidefoot, leftSidefoot;

const headWidth = 8, headHeight = 8, headDepth = 8;
const antennaWidth = 1, antennaHeight = 4, antennaDepth = 1;
const armWidth = 6, armHeight = 16, armDepth = 8;
const forearmWidth = armWidth, forearmHeight = 6, forearmDepth = 24;
const torsoWidth = 24, torsoHeight = 16, torsoDepth = 24;
const abdomenWidth = 12, abdomenHeight = 14, abdomenDepth = torsoDepth;
const waistWidth = torsoWidth, waistHeight = 4, waistDepth = 1;
const wheelRadius = 5, wheelHeight = 5;
const thighWidth = 4, thighHeight = 13, thighDepth = 4;
const legWidth = 6, legHeight = 30, legDepth = 6;
const footWidth = legWidth, footHeight = 6, footDepth = 13;
const sidefootWidth = wheelHeight, sidefootHeight = footHeight, sidefootDepth = 4;

const offset = 0.1; // offset to avoid overlapping

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    scene.add(new THREE.AxesHelper(30));

    createRobot();
}

function createMaterials() {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    materials.push(material);

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    materials.push(material);

    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    materials.push(material);
    
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    materials.push(material);
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
    camera.position.set(0, 0, 20);
    camera.zoom = 6;
    camera.updateProjectionMatrix();
    cameras.push(camera);
}

function createSideCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    camera.position.set(20, 0, 0);
    camera.rotation.y = Math.PI / 2;
    camera.zoom = 6;
    camera.updateProjectionMatrix();
    cameras.push(camera);
}

function createTopCamera() { 
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    camera.position.set(0, 50, 0);
    camera.rotation.x = - Math.PI / 2;
    camera.zoom = 6;
    camera.updateProjectionMatrix();
    cameras.push(camera);
}

function createIsometricCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(scene.position);
    camera.zoom = 6;
    camera.updateProjectionMatrix();
    cameras.push(camera);    
}

function createPrespectiveCamera() {
    'use strict';

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(scene.position);

    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
	controls.maxDistance = 1000;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.update() must be called after any manual changes to the camera's transform

    cameras.push(camera);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createRobot() {
    createHead();

    headSet = new THREE.Object3D();
    headSet.add(head);
    headSet.add(leftAntenna);
    headSet.add(rightAntenna);
    // headSet.rotation.x = 0;
    headSet.position.set(0, abdomenHeight + torsoHeight - offset, 0);

    createLeftArm();

    leftArmSet = new THREE.Object3D();
    leftArmSet.add(leftArm);
    leftArmSet.add(leftForearm);
    leftArmSet.position.set(- torsoWidth / 2 - armWidth / 2, abdomenHeight + torsoHeight, - torsoDepth / 2 + armDepth / 2);

    createRigthArm();

    rigthArmSet = new THREE.Object3D();
    rigthArmSet.add(rightArm);
    rigthArmSet.add(rightForearm);
    rigthArmSet.position.set(torsoWidth / 2 + armWidth / 2, abdomenHeight + torsoHeight, - torsoDepth / 2 + armDepth / 2);

    createTorso();

    createAbdomen();

    createWaist();

    createThigh();

    createLeg();

    createFoot();

    footSet = new THREE.Object3D();
    footSet.add(leftFoot);
    footSet.add(rightFoot);
    footSet.add(leftSidefoot);
    footSet.add(rightSidefoot);
    // footSet.rotation.x = 0;
    footSet.position.set(0, - thighHeight - legHeight + footHeight / 2, 0);
    console.log('footSet');
    console.log(footSet.position);

    legSet = new THREE.Object3D();
    legSet.add(leftThigh);
    legSet.add(rightThigh);
    legSet.add(leftLeg);
    legSet.add(rightLeg);
    legSet.add(lowerLeftLegWheel);
    legSet.add(lowerRightLegWheel);
    legSet.add(footSet);
    //legSet.rotation.x = Math.PI / 2;
    legSet.position.set(0, legDepth / 2,  thighHeight - abdomenDepth / 2);
    console.log('legSet');
    console.log(legSet.position);

    robot = new THREE.Object3D();
    robot.add(headSet);
    robot.add(rigthArmSet);
    robot.add(leftArmSet);
    robot.add(torso);
    robot.add(abdomen);
    robot.add(waist);
    robot.add(leftWaistWheel);
    robot.add(rightWaistWheel);
    robot.add(legSet);

    scene.add(robot);
}

function createHead() {
    'use strict';

    head = new THREE.Mesh(new THREE.BoxGeometry(headWidth, headHeight, headDepth), materials[3]);
    head.position.set(0, headHeight / 2 + offset, 0); 

    leftAntenna = new THREE.Mesh(new THREE.BoxGeometry(antennaWidth, antennaHeight, antennaDepth), materials[3]);
    leftAntenna.position.set(headWidth / 2 - antennaWidth, headHeight + offset + antennaHeight/2, 0);

    rightAntenna = new THREE.Mesh(new THREE.BoxGeometry(antennaWidth, antennaHeight, antennaDepth), materials[3]);
    rightAntenna.position.set(- headWidth / 2 + antennaWidth, headHeight + offset + antennaHeight/2, 0);
}

function createTorso() {
    'use strict';

    torso = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth, torsoHeight, torsoDepth), materials[0]);
    torso.position.set(0, abdomenHeight + torsoHeight / 2, 0);
}

function createAbdomen() {
    'use strict';

    abdomen = new THREE.Mesh(new THREE.BoxGeometry(abdomenWidth, abdomenHeight, abdomenDepth), materials[0]);
    abdomen.position.set(0, abdomenHeight / 2, 0);
}

function createWaist() {
    'use strict';

    waist = new THREE.Mesh(new THREE.BoxGeometry(waistWidth, waistHeight, waistDepth), materials[1]);
    waist.position.set(0, waistHeight / 2, torsoDepth / 2 + waistDepth / 2);

    leftWaistWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    leftWaistWheel.rotation.z = Math.PI / 2;
    leftWaistWheel.position.set(- abdomenWidth / 2 - 1 - wheelHeight / 2, waistHeight / 2, abdomenDepth / 6);

    rightWaistWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    rightWaistWheel.rotation.z = Math.PI / 2;
    rightWaistWheel.position.set(abdomenWidth / 2 + 1 + wheelHeight / 2, waistHeight / 2, abdomenDepth / 6);
}

function createThigh() {
    'use strict';

    leftThigh = new THREE.Mesh(new THREE.BoxGeometry(thighWidth, thighHeight, thighDepth), materials[1]);
    leftThigh.position.set(- abdomenWidth / 2 + thighWidth / 2 + offset, - thighHeight / 2, 0);

    rightThigh = new THREE.Mesh(new THREE.BoxGeometry(thighWidth, thighHeight, thighDepth), materials[1]);
    rightThigh.position.set(abdomenWidth / 2 - thighWidth / 2 - offset, - thighHeight / 2 , 0);
}

function createLeg() {
    'use strict';

    leftLeg = new THREE.Mesh(new THREE.BoxGeometry(legWidth, legHeight, legDepth), materials[3]);
    leftLeg.position.set(- abdomenWidth / 2 + thighWidth / 2 + offset, - thighHeight - legHeight / 2, 0);

    rightLeg = new THREE.Mesh(new THREE.BoxGeometry(legWidth, legHeight, legDepth), materials[3]);
    rightLeg.position.set(abdomenWidth / 2 - thighWidth / 2 - offset, - thighHeight - legHeight / 2, 0);

    lowerLeftLegWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    lowerLeftLegWheel.rotation.z = Math.PI / 2;
    lowerLeftLegWheel.position.set(- abdomenWidth / 2 - wheelHeight / 2 - 1 + offset, - thighHeight - legHeight + wheelRadius + 1, legDepth / 2 - waistHeight / 2);

    lowerRightLegWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    lowerRightLegWheel.rotation.z = Math.PI / 2;
    lowerRightLegWheel.position.set(abdomenWidth / 2 + wheelHeight / 2 + 1 - offset, - thighHeight - legHeight + wheelRadius + 1, legDepth / 2 - waistHeight / 2);
    console.log('lowerRightLegWheel');
    console.log(lowerRightLegWheel.position);
}

function createRigthArm() {
    'use strict';

    rightArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armDepth), materials[0]);
    rightArm.position.set(0, - armHeight / 2, 0);

    rightForearm = new THREE.Mesh(new THREE.BoxGeometry(forearmWidth, forearmHeight, forearmDepth), materials[0]);
    rightForearm.position.set(0, - armHeight - forearmHeight / 2, torsoDepth / 2 - armDepth / 2);
}

function createLeftArm() {
    'use strict';

    leftArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armDepth), materials[0]);
    leftArm.position.set(0, - armHeight / 2, 0);

    leftForearm = new THREE.Mesh(new THREE.BoxGeometry(forearmWidth, forearmHeight, forearmDepth), materials[0]);
    leftForearm.position.set(0, - armHeight - forearmHeight / 2,  torsoDepth / 2 - armDepth / 2);
}

function createFoot() {
    'use strict';

    leftFoot = new THREE.Mesh(new THREE.BoxGeometry(footWidth, footHeight, footDepth), materials[3]);
    leftFoot.position.set(- abdomenWidth / 2 + thighWidth / 2 + offset , 0, footDepth / 2 - footHeight / 2);

    rightFoot = new THREE.Mesh(new THREE.BoxGeometry(footWidth, footHeight, footDepth), materials[3]);
    rightFoot.position.set(abdomenWidth / 2 - thighWidth / 2 - offset, 0, footDepth / 2 - footHeight / 2);

    leftSidefoot = new THREE.Mesh(new THREE.BoxGeometry(sidefootWidth, sidefootHeight, sidefootDepth), materials[3]);
    leftSidefoot.position.set(- abdomenWidth / 2 - 1 + offset - sidefootWidth / 2, 0, footDepth - footHeight / 2 - sidefootDepth / 2);

    rightSidefoot = new THREE.Mesh(new THREE.BoxGeometry(sidefootWidth, sidefootHeight, sidefootDepth), materials[3]);
    rightSidefoot.position.set(abdomenWidth / 2 + 1 - offset + sidefootWidth / 2, 0, footDepth - footHeight / 2 - sidefootDepth / 2);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

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
function update(){
    'use strict';

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

    createMaterials();

    createScene();

    createCameras();
    
    render();

    var gui = new dat.GUI();

    var camerasFolder = gui.addFolder( 'Cameras' );

    var frontFolder = camerasFolder.addFolder( 'Front Camera');
    frontFolder.add(cameras[0], 'zoom', 3, 8).onChange(function (value) {cameras[0].updateProjectionMatrix();});
    // frontFolder.add(cameras[0].position, 'x', -30, 30);
    // frontFolder.add(cameras[0].position, 'y', -5, 5);

    var sideFolder = camerasFolder.addFolder( 'Side Camera');
    sideFolder.add(cameras[1], 'zoom', 3, 8).onChange(function (value) {cameras[1].updateProjectionMatrix();});
    // sideFolder.add(cameras[1].position, 'y', -5, 5);
    // sideFolder.add(cameras[1].position, 'z', -30, 30);

    var topFolder = camerasFolder.addFolder( 'Top Camera');
    topFolder.add(cameras[2], 'zoom', 3, 8).onChange(function (value) {cameras[2].updateProjectionMatrix();});
    // topFolder.add(cameras[2].position, 'x', -30, 30).onChange(function (value) {cameras[2].updateProjectionMatrix();});;
    // topFolder.add(cameras[2].position, 'z', -30, 30).onChange(function (value) {cameras[2].updateProjectionMatrix();});;

    var isometricFolder = camerasFolder.addFolder( 'Isometric Orthographic Camera');
    isometricFolder.add(cameras[3], 'zoom', 3, 6).onChange(function (value) {cameras[3].updateProjectionMatrix();});
    isometricFolder.add(cameras[3].position, 'x', 0, 50).onChange(function (value) {cameras[3].lookAt(scene.position);});
    isometricFolder.add(cameras[3].position, 'y', 0, 50).onChange(function (value) {cameras[3].lookAt(scene.position);});
    isometricFolder.add(cameras[3].position, 'z', 0, 50).onChange(function (value) {cameras[3].lookAt(scene.position);});

    var headFolder = gui.addFolder("Head");
    headFolder.add(headSet.rotation, 'x', - Math.PI, 0);
    headFolder.open();

    var legFolder = gui.addFolder("Leg");
    legFolder.add(legSet.rotation, 'x', 0, Math.PI / 2);
    legFolder.open();

    var armFolder = gui.addFolder("Arm");
    armFolder.add(rigthArmSet.position, 'x', torsoWidth / 2 - armWidth / 2, torsoWidth / 2 + armWidth / 2);
    armFolder.add(leftArmSet.position, 'x', - torsoWidth / 2 - armWidth / 2, - torsoWidth / 2 + armWidth / 2);
    armFolder.open();

    var footFolder = gui.addFolder("Foot");
    footFolder.add(footSet.rotation, 'x', 0, Math.PI / 2);
    footFolder.open();
    
    window.addEventListener("keydown", onKeyDown);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    render();

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

    switch (e.keyCode) {
        case 49: //1 Frontal Camera
            camera = cameras[0];
            break;
        case 50: //2 Side Camera
            camera = cameras[1];
            break;
        case 51: //3 Top Camera
            camera = cameras[2];
            break;
        case 52: //3 Isometric Orthographic Camera
            camera = cameras[3];
            break;
        case 53: //3 Isometric Prespective Camera
            camera = cameras[4];
            break;
        case 54: //A Toggle Wireframe
            materials.forEach(material => {material.wireframe = !material.wireframe});
            break;
        }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}