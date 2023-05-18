//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var cameras = [];

var materials = [];

var controls;

var robot;
var headSet, head, antenna1, antenna2;
var leftArmSet, rigthArmSet, leftArm, rightArm, leftForearm, rightForearm;
var torso, abdomen, waist, leftWaistWheel, rightWaistWheel;
var legSet, rightThigh, leftThigh, rightLeg, leftLeg, rightFoot, leftFoot, upperLeftLefWheel, lowerLeftLefWheel, uppperRightLegWheel;

const headWidth = 8, headHeight = 8, headDepth = 8;

const armWidth = 6, armHeight = 16, armDepth = 8;
const forearmWidth = armWidth, forearmHeight = 6, forearmDepth = 24;
const torsoWidth = 24, torsoHeight = 16, torsoDepth = 24;
const abdomenWidth = 12, abdomenHeight = 14, abdomenDepth = torsoDepth;
const waistWidth = torsoWidth, waistHeight = 4, waistDepth = 1;
const wheelRadius = 5, wheelHeight = 5;
const thighWidth = 4, thighHeight = 14, thighDepth = 4;
const legWidth = 6, legHeight = 26, legDepth = 6;
const antennaWidth = 1, antennaHeight = 4, antennaDepth = 1;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    scene.add(new THREE.AxesHelper(30));

    createRobot();

    // createRectangle(0, 0, 0, CTORSO, CTORSO, LTORSO, 0x000000);
    // createRectangle(0, -CTORSO/2 - HABDOMEN/2, 0, CABDOMEN, HABDOMEN, LABDOMEN, 0x000000);
    // createRectangle(CABDOMEN/2 + CCINTURA/2, -CTORSO/2 - HABDOMEN + HCINTURA/2, 0, CCINTURA, HCINTURA, LCINTURA, 0x000000);
    // createCylinder(RRODA/8, -CTORSO/2 - HABDOMEN + HCINTURA/2, LCINTURA/2 - RRODA/2, RRODA, HRODA, 0x000000);
    // createCylinder(RRODA/8, -CTORSO/2 - HABDOMEN + HCINTURA/2, -LCINTURA/2 + RRODA/2, RRODA, HRODA, 0x000000);
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

function createCamera() {
    'use strict';

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(scene.position);

    cameras.push(camera);

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
	controls.maxDistance = 1000;
    //controls.maxPolarAngle = Math.PI / 2;
    // controls.update() must be called after any manual changes to the camera's transform
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createRobot() {
    createHead();

    headSet = new THREE.Object3D();
    headSet.add(head);
    // headSet.rotation.x = 0;
    headSet.position.set(0, torsoHeight / 2 - 1, 0);

    createAntennas();

    headSet.add(antenna1);
    headSet.add(antenna2);

    createRigthArm();

    rigthArmSet = new THREE.Object3D();
    rigthArmSet.add(rightArm);
    rigthArmSet.add(rightForearm);
    rigthArmSet.position.set(torsoWidth / 2 + armWidth / 2, 0, - torsoDepth / 2 + armDepth / 2);

    createLeftArm();

    leftArmSet = new THREE.Object3D();
    leftArmSet.add(leftArm);
    leftArmSet.add(leftForearm);
    leftArmSet.position.set(- torsoWidth / 2 - armWidth / 2, 0, - torsoDepth / 2 + armDepth / 2);

    createTorso();

    createAbdomen();

    createWaist();

    createThigh();

    createLeg();

    legSet = new THREE.Object3D();
    legSet.add(leftThigh);
    legSet.add(rightThigh);
    legSet.add(leftLeg);
    legSet.add(rightLeg);
    //legSet.rotation.x = Math.PI / 2;
    legSet.position.set(0, - torsoHeight / 2 - abdomenHeight + legDepth / 2,  thighHeight - abdomenDepth / 2);

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
    head.position.set(0, headHeight / 2 + 1, 0); 
}

function createAntennas() {
    'use strict';

    antenna1 = new THREE.Mesh(new THREE.BoxGeometry(antennaWidth, antennaHeight, antennaDepth), materials[3]);
    antenna1.position.set(headWidth / 2 - antennaWidth, headHeight + 1 + antennaHeight/2, 0);

    antenna2 = new THREE.Mesh(new THREE.BoxGeometry(antennaWidth, antennaHeight, antennaDepth), materials[3]);
    antenna2.position.set(- headWidth / 2 + antennaWidth, headHeight + 1 + antennaHeight/2, 0);
}
function createTorso() {
    'use strict';

    torso = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth, torsoHeight, torsoDepth), materials[0]);
}

function createAbdomen() {
    'use strict';

    abdomen = new THREE.Mesh(new THREE.BoxGeometry(abdomenWidth, abdomenHeight, abdomenDepth), materials[0]);
    abdomen.position.set(0, - torsoHeight / 2 - abdomenHeight / 2, 0);
}

function createWaist() {
    'use strict';

    waist = new THREE.Mesh(new THREE.BoxGeometry(waistWidth, waistHeight, waistDepth), materials[1]);
    waist.position.set(0, - torsoHeight / 2 - abdomenHeight + waistHeight / 2, torsoDepth / 2 + waistDepth / 2);

    leftWaistWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    leftWaistWheel.rotation.z = Math.PI / 2;
    leftWaistWheel.position.set(- abdomenWidth / 2 - wheelHeight / 2 - 1, - torsoHeight / 2 - abdomenHeight + waistHeight / 2, abdomenDepth / 6);

    rightWaistWheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 32), materials[2]);
    rightWaistWheel.rotation.z = Math.PI / 2;
    rightWaistWheel.position.set(abdomenWidth / 2 + wheelHeight / 2 + 1, - torsoHeight / 2 - abdomenHeight + waistHeight / 2, abdomenDepth / 6);
}

function createThigh() {
    'use strict';

    leftThigh = new THREE.Mesh(new THREE.BoxGeometry(thighWidth, thighHeight, thighDepth), materials[1]);
    leftThigh.position.set(- abdomenWidth / 2 + thighWidth / 2 + 0.01, - thighHeight / 2, 0);

    rightThigh = new THREE.Mesh(new THREE.BoxGeometry(thighWidth, thighHeight, thighDepth), materials[1]);
    rightThigh.position.set(abdomenWidth / 2 - thighWidth / 2 - 0.01, - thighHeight / 2 , 0);
}

function createLeg() {
    'use strict';

    leftLeg = new THREE.Mesh(new THREE.BoxGeometry(legWidth, legHeight, legDepth), materials[3]);
    leftLeg.position.set(- abdomenWidth / 2 + thighWidth / 2 + 0.01, - thighHeight - legHeight / 2, 0);

    rightLeg = new THREE.Mesh(new THREE.BoxGeometry(legWidth, legHeight, legDepth), materials[3]);
    rightLeg.position.set(abdomenWidth / 2 - thighWidth / 2 - 0.01, - thighHeight - legHeight / 2, 0);
}

function createRigthArm() {
    'use strict';

    rightArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armDepth), materials[0]);

    rightForearm = new THREE.Mesh(new THREE.BoxGeometry(forearmWidth, forearmHeight, forearmDepth), materials[0]);
    rightForearm.position.set(0, - armHeight / 2 - forearmHeight / 2, torsoDepth / 2 - armDepth / 2);
}

function createLeftArm() {
    'use strict';

    leftArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armDepth), materials[0]);

    leftForearm = new THREE.Mesh(new THREE.BoxGeometry(forearmWidth, forearmHeight, forearmDepth), materials[0]);
    leftForearm.position.set(0, - armHeight / 2 - forearmHeight / 2,  torsoDepth / 2 - armDepth / 2);
}

function createRectangle(x, y, z, width, height, depth, color){
    'use strict';

    var rectangle = new THREE.Object3D();

    geometry = new THREE.BoxGeometry(width, height, depth);
    material = new THREE.MeshBasicMaterial({color: color});
    mesh = new THREE.Mesh(geometry, material);

    rectangle.add(mesh);
    rectangle.position.set(x, y, z);

    scene.add(rectangle);
}

function createCylinder(x, y, z, radius, height, color){
    'use strict';

    var cylinder = new THREE.Object3D();

    geometry = new THREE.CylinderGeometry(radius, radius, height);
    material = new THREE.MeshBasicMaterial({color: color});
    mesh = new THREE.Mesh(geometry, material);

    cylinder.add(mesh);
    cylinder.rotation.x = Math.PI/2;
    cylinder.position.set(x, y, z);

    scene.add(cylinder);
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

    createCamera();
    
    render();

    var gui = new dat.GUI();

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
        case 54: //A
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