//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var texturesGenerator = new TexturesGenerator();
var frameTexture;

var ovni, cylinder;

var spotLight;
var pointLight = [];

var clock, delta;

/* */

const starMaterials = [
]



function randomChoice(arr) {
    // get random index value
    let randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    return arr[randomIndex];
}

function randomNumberGenerator(ll, rl) {
    return Math.floor(Math.random() * (rl - ll) + ll);
}

function generateFieldSceneImage(){
    'use strict';

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
    for (let i = 0; i < numberOfFlowers; i++){

        let fieldMesh = new THREE.Mesh(flowerGeometry, randomChoice(flowerMaterials));
        fieldMesh.position.set(Math.random() * window.innerWidth - window.innerWidth / 2 , Math.random() * window.innerHeight - window.innerHeight / 2, 0);
        fieldScene.add(fieldMesh);
    }

    renderer.render(fieldScene, camera);
}

function generateSkySceneImage(){
    'use strict';

    let skyScene = new THREE.Scene();
    let skyMaterials = [
        new THREE.MeshBasicMaterial({color: 'darkblue'}),
        new THREE.MeshBasicMaterial({color: 'darkviolet'})
    ]
    let starGeometry = new THREE.SphereGeometry(1, 1, 1);
    skyScene.background = new THREE.Texture.gradientmap('ba');

    let numberOfstars = randomNumberGenerator(100,1000);
    for (let i = 0; i < numberOfstars; i++){

        let starMesh = new THREE.Mesh(starGeometry, randomChoice(skyMaterials));
        starMesh.position.set(Math.random() * window.innerWidth - window.innerWidth / 2 , Math.random() * window.innerHeight - window.innerHeight / 2, 0);
        skyScene.add(starMesh);
    }
}


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    scene.add(new THREE.AxesHelper(100));

    geometry = new THREE.PlaneGeometry(128*2, 128*2);

    // frameTexture = texturesGenerator.generateFieldTexture();
    // material = new THREE.MeshBasicMaterial( { map: frameTexture });

    material = new THREE.MeshPhongMaterial( { color: 'green' });

    mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = - Math.PI / 2;

    scene.add( mesh );

    ovni = new THREE.Object3D();
    ovni.userData = { xPositive: 0, xNegative: 0, zPositive: 0, zNegative: 0 };
    createOvni();
    ovni.position.set(0, 100, 0);
    scene.add(ovni);
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

    createSpotLight();
    createPointLights();
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

    ovni.position.x += (ovni.userData.xPositive - ovni.userData.xNegative) * 20 * delta;
    ovni.position.z += (ovni.userData.zPositive - ovni.userData.zNegative) * 20 * delta;
    //ovni.rotation.y += 0.01;
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    /*renderer.render(scene, camera);*/
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
        case '1': // Frontal Camera
            generateFieldSceneImage();
            break;
        case '2': // Side Camera
            generateSkySceneImage();
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