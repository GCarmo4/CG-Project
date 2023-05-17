//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var controls;

const CTORSO = 7;
const LTORSO = 13;

const CABDOMEN = 7;
const HABDOMEN = 6;
const LABDOMEN = 7;

const CCINTURA = 1;
const HCINTURA = 2;
const LCINTURA = 13;

const RRODA = 2;
const HRODA = 2;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color( 0xffffff );
    createRectangle(0, 0, 0, CTORSO, CTORSO, LTORSO, 0x000000);
    createRectangle(0, -CTORSO/2 - HABDOMEN/2, 0, CABDOMEN, HABDOMEN, LABDOMEN, 0x000000);
    createRectangle(CABDOMEN/2 + CCINTURA/2, -CTORSO/2 - HABDOMEN + HCINTURA/2, 0, CCINTURA, HCINTURA, LCINTURA, 0x000000);
    createCylinder(RRODA/8, -CTORSO/2 - HABDOMEN + HCINTURA/2, LCINTURA/2 - RRODA/2, RRODA, HRODA, 0x000000);
    createCylinder(RRODA/8, -CTORSO/2 - HABDOMEN + HCINTURA/2, -LCINTURA/2 + RRODA/2, RRODA, HRODA, 0x000000);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set(50, 50, 50);
    camera.lookAt(scene.position);
    controls.update();
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
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

    createScene();
    createCamera();

    render();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

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

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}