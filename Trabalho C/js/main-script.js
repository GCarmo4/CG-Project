//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var _generateSky;
var _generateField;

var ovni, cylinder, field, sky;

var spotLight;
var pointLight = [];

var clock, delta;

const TEXTURES_PATH = "C:\\Users\\rogst\\Documents\\cgraf\\CG\\Trabalho C\\";

function generateSky() {
    return _generateSky;
}

function setGenerateSky() {
    _generateSky = true;
}

function doneGeneratingSky() {
    _generateSky = false;
}

function generateField() {
    return _generateField;
}

function setGenerateField() {
    _generateField = true;
}

function doneGeneratingField() {
    _generateField = false;
}

function randomChoice(arr) {
    // get random index value
    let randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    return arr[randomIndex];
}

function randomNumberGenerator(ll, rl) {
    return Math.floor(Math.random() * (rl - ll) + ll);
}

function createFieldScene() {
    let fieldScene = new THREE.Scene();
    let flowerMaterials = [
        new THREE.MeshBasicMaterial({color: 'white'}),
        new THREE.MeshBasicMaterial({color: 'yellow'}),
        new THREE.MeshBasicMaterial({color: 0xC8A2C8}), // lilac
        new THREE.MeshBasicMaterial({color: 'lightblue'})
    ];
    let flowerGeometry = new THREE.SphereGeometry(1, 1, 1);
    fieldScene.background = new THREE.Color('lightgreen');

    let numberOfFlowers = randomNumberGenerator(100,1000);
    for (let i = 0; i < numberOfFlowers; i++) {

        let fieldMesh = new THREE.Mesh(flowerGeometry, randomChoice(flowerMaterials));
        fieldMesh.position.set(Math.random() * window.innerWidth - window.innerWidth / 2, Math.random() * window.innerHeight - window.innerHeight / 2, 0);
        fieldScene.add(fieldMesh);
    }

    return fieldScene;
}

function createFieldCamera() {
    'use strict';

    let fieldCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    fieldCamera.position.set(0, 0, 200);
    fieldCamera.lookAt(0, 0, 0);

    return fieldCamera;
}

function createSkyCamera() {
    'use strict';

    let skyCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    skyCamera.position.set(0, 0, 200);
    skyCamera.lookAt(0, 0, 0);

    return skyCamera;
}

function generateFieldSceneTexture(){
    'use strict';

    let fieldRenderer = new THREE.WebGLRenderer({
        antialias: true
    }); fieldRenderer.setSize(window.innerWidth, window.innerHeight);

    let fieldScene = createFieldScene();
    let fieldCamera = createFieldCamera();


    fieldRenderer.render(fieldScene, fieldCamera);

    return new THREE.CanvasTexture(fieldRenderer.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping) // this is not getting the colors
}

function saveTexture(r) {
    r.domElement.toBlob(function(blob){
        var a = document.createElement('a');
        var url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'aoeu';
        a.click();
    }, 'image/png', 1.0);
}

function createSkyScene() {
    let skyScene = new THREE.Scene();
    /*let skyMaterials = [
        new THREE.MeshBasicMaterial({color: 'darkblue'}),
        new THREE.MeshBasicMaterial({color: 'darkviolet'})
    ]*/

    let starMaterials = [
        new THREE.MeshBasicMaterial({color: 'white'})
    ]
    let starGeometry = new THREE.SphereGeometry(1, 1, 1);

    // o background com textura nao funciona nao entendo so falta isto, o resto esta feito
    skyScene.background = new THREE.TextureLoader().load('textures/skyBackground.png'); // depois logo se pergunta se pode ser so assim

    let numberOfstars = randomNumberGenerator(100,1000);
    for (let i = 0; i < numberOfstars; i++){
        let starMesh = new THREE.Mesh(starGeometry, randomChoice(starMaterials));
        starMesh.position.set(Math.random() * window.innerWidth - window.innerWidth / 2 , Math.random() * window.innerHeight - window.innerHeight / 2, 0);
        skyScene.add(starMesh);
    }

    return skyScene;
}

function generateSkySceneTexture(){
    'use strict';

    let skyRenderer = new THREE.WebGLRenderer({
        antialias: true
    }); skyRenderer.setSize(window.innerWidth, window.innerHeight);

    let skyScene = createSkyScene();
    let skyCamera = createSkyCamera();

    // skyScene.background = new THREE.TextureLoader().load('textures/skyBackground.png'); nao funciona


    skyRenderer.render(skyScene, skyCamera);
    // saveTexture(skyRenderer)
    return new THREE.CanvasTexture(skyRenderer.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping) // this is not getting the colors
}



/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createField() {
    geometry = new THREE.PlaneGeometry(128*2, 128*2, 128*2/10, 128*2/10);

    let texture = new THREE.TextureLoader().load('textures/heightmap.png' );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    material = new THREE.MeshStandardMaterial( {map: texture, displacementMap: texture, displacementScale:200} );

    field = new THREE.Mesh( geometry, material );
    field.rotation.x = - Math.PI / 2;

    scene.add( field );
}

function createSky() {
    geometry = new THREE.SphereGeometry(128*2, 128*2, 128*2);

    // color para desenrascar por enquanto
    material = new THREE.MeshBasicMaterial( {color: 'lightblue', side: THREE.BackSide} );

    sky = new THREE.Mesh( geometry, material );

    scene.add( sky );
}

function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color('white'); // doesn't quite matter

    // scene.add(new THREE.AxesHelper(100));

    createField();
    createSky();
/*
    ovni = new THREE.Object3D();
    ovni.userData = { xPositive: 0, xNegative: 0, zPositive: 0, zNegative: 0 };
    createOvni();
    ovni.position.set(0, 100, 0);
    scene.add(ovni);*/
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras(){
    'use strict';

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(140, 140, 140);
    camera.lookAt(scene.position);

    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
 	controls.maxDistance = 1000;
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights(){
    'use strict';

    /*
    createSpotLight();
    createPointLights();
     */
    createAmbientLight();
}

function createAmbientLight(){
    'use strict';

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add( ambientLight );
}

function createSpotLight() {
    'use strict';

    // spotLight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 6, 0 );
    // spotLight.position.set( ovni.position.x, ovni.position.y, ovni.position.z );
    // scene.add( spotLight );

    // scene.add( new THREE.SpotLightHelper( spotLight ) );

    spotLight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 6, 0 );
    spotLight.position.set( 0, 0, 0 );
    ovni.add( spotLight );

    scene.add( new THREE.SpotLightHelper( spotLight ) );
}

function createPointLights() {
    'use strict';

    for (var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
        var pointLight = new THREE.PointLight( 0xff0000, 1 , 150);
        pointLight.position.set( ovni.position.x + 18  * Math.cos(angle), ovni.position.y - 2.75, ovni.position.z + 18 * Math.sin(angle) );
        scene.add( pointLight );

        scene.add( new THREE.PointLightHelper( pointLight, 5 ) );
    }
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createOvni(){
    'use strict';
    
    material = new THREE.MeshBasicMaterial( {color: 'grey', wireframe: false} );
    
    var body = new THREE.Mesh( new THREE.SphereGeometry( 28, 32, 16 ), material );
    body.scale.set(1, 4 / 28, 1);
    ovni.add( body );

    var cockpit = new THREE.Mesh( new THREE.SphereGeometry( 10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 ), material );
    ovni.add( cockpit );

    cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 6, 6, 4, 32 ), material );
    cylinder.position.set(0, - 4, 0);
    ovni.add( cylinder );

    material = new THREE.MeshBasicMaterial( {color: 'red', wireframe: false} );

    for (var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
        var smallLight = new THREE.Mesh( new THREE.SphereGeometry( 2, 32, 16 ), material );
        smallLight.position.set(18  * Math.cos(angle), - 2.75, 18 * Math.sin(angle));
        ovni.add( smallLight );
    }
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

    if (generateField()) {
        field.material.map = generateFieldSceneTexture();
        doneGeneratingField();
    }

    if (generateSky()) {
        sky.material.map = generateSkySceneTexture();
        doneGeneratingSky()
    }

    /*
    ovni.position.x += (ovni.userData.xPositive - ovni.userData.xNegative) * 20 * delta;
    ovni.position.z += (ovni.userData.zPositive - ovni.userData.zNegative) * 20 * delta;
    //ovni.rotation.y += 0.01;*/
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
    }); renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(renderer.domElement);

    doneGeneratingField();
    doneGeneratingSky();

    createScene();
    createCameras();
    createLights();

    render();

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    delta = clock.getDelta();

    update();
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

    switch (e.key) {
        case '1':
            setGenerateField();
            break;
        case '2':
            setGenerateSky();
            break;
        case 'ArrowLeft': // ovni left
            ovni.userData.xNegative = 1;
            break;
        case 'ArrowUp': // ovni back
            ovni.userData.zNegative = 1;
            break;
        case 'ArrowRight': // ovni right
            ovni.userData.xPositive = 1;
            break;
        case 'ArrowDown': // ovni front
            ovni.userData.zPositive = 1;
            break;

        case 'P': case 'p': // toggle out
            break;
        case 'S': case 's': // legs in
            break;  
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch (e.key) {
        case 'ArrowLeft':
            ovni.userData.xNegative = 0;
            break;
        case 'ArrowUp':
            ovni.userData.zNegative = 0;
            break;
        case 'ArrowRight':
            ovni.userData.xPositive = 0;
            break;
        case 'ArrowDown':
            ovni.userData.zPositive = 0;
            break;
    }
}