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

var lSide, rSide, front, back, roof, chimney, windows, door, house;

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

    let numberOfFlowers = randomNumberGenerator(1000,2000);
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

    let texture = new THREE.CanvasTexture(fieldRenderer.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping) // this is not getting the colors
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );

    return texture;
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
    let starGeometry = new THREE.SphereGeometry(1);

    // o background com textura nao funciona nao entendo so falta isto, o resto esta feito
    // skyScene.background = new THREE.TextureLoader().load('textures/skyBackground.png'); // depois logo se pergunta se pode ser so assim

    //skyScene.background = new THREE.TextureLoader().load('textures/skyBackground.png'); //  nao funciona
    skyScene.background = new THREE.Color('darkblue');

    let numberOfstars = randomNumberGenerator(100,500);
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

    //skyScene.background = new THREE.TextureLoader().load('textures/skyBackground.png'); //  nao funciona

    skyRenderer.render(skyScene, skyCamera);
    //saveTexture(skyRenderer)
    let texture = new THREE.CanvasTexture(skyRenderer.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping) // this is not getting the colors
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );
    return texture;
}


/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createField() {
    geometry = new THREE.PlaneGeometry(128*8, 128*8, 128*8/10, 128*8/10);

    let texture = new THREE.TextureLoader().load('textures/heightmap.png' );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    material = new THREE.MeshStandardMaterial( {map: texture, displacementMap: texture, displacementScale:200} );

    field = new THREE.Mesh( geometry, material );
    field.rotation.x = - Math.PI / 2;

    scene.add( field );
}

function createSky() {
    geometry = new THREE.SphereGeometry(128*5, 128, 128, 0, 2*Math.PI, 0, 0.5 * Math.PI);

    // take out after
    let texture = new THREE.TextureLoader().load('textures/skyBackground.png');

    // color para desenrascar por enquanto
    material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.BackSide} );

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
    createHouse();

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras(){
    'use strict';

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
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

function createHouse(){
    'use strict';

    house = new THREE.Object3D();

    createHouseSides();
    createHouseBack();
    createHouseFront();
    createHouseRoof();
    createHouseChimney();
    createHouseWindows();
    createHouseDoor();

    scene.add(house);
}

function createHouseSides(){
    'use strict';

    var geom = new THREE.BufferGeometry();

    const vertices = [
        0, 0, 0, // 0
        0, 0, 16, // 1
        0, 12, 16, // 2
        0, 12, 0, // 3
        0, 16, 8 // 4
    ];

    const indices = [
        0, 1, 2, // first triangle
        2, 3, 0, // second triangle
        3, 2, 4
    ];

    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial( { color: 'white' });

    lSide = new THREE.Mesh( geom, material );

    house.add(lSide);

    rSide = new THREE.Mesh( geom, material );

    rSide.position.set(36, 0, 16);

    rSide.rotation.y = Math.PI;

    house.add(rSide);
}

function createHouseFront(){
    'use strict';

    var geom = new THREE.BufferGeometry();

    const vertices = [
        //left of door
        0, 0, 0, //0
        11, 0, 0, //1
        11, 4, 0, //2
        0, 4, 0, //3
        4, 4, 0, //4
        4, 8, 0, //5
        0, 8, 0, //6
        8, 4, 0, //7
        11, 8, 0, //8
        8, 8, 0, //9
        //right of door
        17, 0, 0, //10
        36, 0, 0, //11
        36, 4, 0, //12
        17, 4, 0, //13
        20, 4, 0, //14
        20, 8, 0, //15
        17, 8, 0, //16
        24, 4, 0, //17
        28, 4, 0, //18
        28, 8, 0, //19
        24, 8, 0, //20
        32, 4, 0, //21
        36, 8, 0, //22
        32, 8, 0, //23
        //top bar
        36, 12, 0, //24
        0, 12, 0, //25
    ];

    const indices = [
        //left of door
        0, 1, 2, //0
        2, 3, 0, //1
        3, 4, 5, //2
        5, 6, 3, //3
        7, 2, 8, //4
        8, 9, 7, //5
        //right of door
        10, 11, 12, 
        12, 13, 10, 
        13, 14, 15, 
        15, 16, 13,         
        17, 18, 19, 
        19, 20, 17, 
        21, 12, 22, 
        22, 23, 21, 
        //top bar
        6, 22, 24, 
        24, 25, 6 
    ];

    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial( { color: 'white' } );

    front = new THREE.Mesh( geom, material );

    front.position.set(0, 0, 16);

    house.add(front);
}

function createHouseBack(){
    'use strict';

    var geom = new THREE.BufferGeometry();

    const vertices = [
        0, 0, 0, //0
        36, 0, 0, //1
        36, 12, 0, //2
        0, 12, 0, //3
    ];

    const indices = [
        1, 0, 3, // first triangle
        3, 2, 1 // second triangle
    ];

    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial( { color: 'white' } );

    back = new THREE.Mesh( geom, material );

    house.add(back);
}

function createHouseRoof(){
    'use strict';

    var geom = new THREE.BufferGeometry();

    const vertices = [
        //back roof
        36, 0, 0, //0
        0, 0, 0, //1
        0, 4, 8, //2
        36, 4, 8, //3
        //front roof
        0, 0, 16, //4
        36, 0, 16, //5
    ];

    const indices = [
        //back roof
        0, 1, 2, // first triangle
        2, 3, 0, // second triangle
        //front roof
        4, 5, 3,
        3, 2, 4
    ];

    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial( { color: 'orange'});

    roof = new THREE.Mesh( geom, material );

    roof.position.set(0, 12, 0);

    house.add(roof);
}

function createHouseChimney(){
    'use strict';

    var geom = new THREE.BufferGeometry();

    const vertices = [
        //back
        6, 0, 0, //0
        0, 0, 0, //1
        0, 5, 0, //2
        6, 5, 0, //3
        //l side
        0, 1, 2, //4
        0, 5, 2, //5
        //r side
        6, 1, 2, //6
        6, 5, 2, //7
    ];

    const indices = [
        //back
        0, 1, 2, // first triangle
        2, 3, 0,// second triangle
        //l side
        1, 4, 5,
        5, 2, 1,
        //r side
        6, 0, 3,
        3, 7, 6,
        //front
        4, 6, 7,
        7, 5, 4,
        //top
        3, 2, 5,
        5, 7, 3
    ];

    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial( { color: 'white' });

    chimney = new THREE.Mesh( geom, material );

    chimney.position.set(7, 13, 2);

    house.add(chimney);
}

function createHouseWindows(){
    'use strict';

    var geom = new THREE.BufferGeometry();

    const vertices = [  
        //window1
        4, 4, 0, //0
        8, 4, 0, //1
        8, 8, 0, //2
        4, 8, 0, //3
        //window2
        20, 4, 0, //4
        24, 4, 0, //5
        24, 8, 0, //6
        20, 8, 0, //7
        //window3
        28, 4, 0, //8
        32, 4, 0, //9
        32, 8, 0, //10
        28, 8, 0, //11
    ];

    const indices = [
        //window1
        0, 1, 2, // first triangle
        2, 3, 0, // second triangle
        //window2
        4, 5, 6,
        6, 7, 4,
        //window3
        8, 9, 10,
        10, 11, 8
    ];

    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial( { color: 'blue' } );

    windows = new THREE.Mesh( geom, material );

    windows.position.set(0, 0, 16);

    house.add(windows);
}

function createHouseDoor(){
    'use strict';

    var geom = new THREE.BufferGeometry();

    const vertices = [  
        //window1
        11, 0, 0, //0
        17, 0, 0, //1
        17, 8, 0, //2
        11, 8, 0, //3
    ];

    const indices = [
        //window1
        0, 1, 2, // first triangle
        2, 3, 0, // second triangle
    ];

    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial( { color: 'brown' } );

    door = new THREE.Mesh( geom, material );

    door.position.set(0, 0, 16);

    house.add(door);
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

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
    directionalLight.position.set( 1, 1, 1 );
    scene.add( directionalLight );

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