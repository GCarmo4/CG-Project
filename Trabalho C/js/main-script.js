/*
                    Trabalho B                  
Cena Interactiva com Malhas, Materiais, Luzes, 
Texturas e Camara Estereoscopica
        Computacao Grafica - L11 - Grupo 24

92424 Andre Azevedo 10h
99228 Gonçalo Carmo 10h
99245 João Santos 10h
horas despendidas pelo grupo(media do grupo): 10h
*/

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var _generateSky;
var _generateField;

var field, sky;

var moon;

var trees = [];

var house, lSide, rSide, front, back, roof, chimney, windows, door, house;

var ovni;

var directionalLight, directionalLightIntensity = 0.5;
var spotLight, spotLightIntensity = 0.8;
var pointLights = [], pointLightIntensity = 0.25;

var clock, delta;

var materials = [];
var phongMaterials = [];
var lambertMaterials = [];
var toonMaterials = [];
var basicMaterials = [];

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
    let flowerGeometry = new THREE.SphereGeometry(1);
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
    geometry = new THREE.PlaneGeometry(128*10, 128*10, 128*10/10, 128*10/10);

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

    scene.add(new THREE.AxesHelper(100)); // to remove

    createField();
  
    createSky();
  
    createMoon();

    createTrees();

    createHouse();
  
    createOvni();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras(){
    'use strict';

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set(280, 280, 280);
    camera.lookAt(scene.position);

    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
 	controls.maxDistance = 1000;
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createDirectionalLight(){
    'use strict';

    directionalLight = new THREE.DirectionalLight( 0xffffff, directionalLightIntensity );
    directionalLight.position.set( 1, 1, -1 );
    scene.add( directionalLight );
}

function createAmbientLight(){
    'use strict';

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add( ambientLight );
}

function createSpotLight() {
    'use strict';

    spotLight = new THREE.SpotLight( 0xffffff, spotLightIntensity, 0, Math.PI / 6, 0.1 );
    ovni.add( spotLight );

    var targetObject = new THREE.Object3D();
    targetObject.position.set( ovni.position.x, 0, ovni.position.z );
    ovni.add(targetObject);

    spotLight.target = targetObject;

    scene.add( new THREE.SpotLightHelper( spotLight ) ); // to remove

}

function createPointLight(smallSphere) {
    'use strict';

    var pointLight = new THREE.PointLight( 0xff0000, pointLightIntensity, 200 );
    pointLights.push( pointLight );
    smallSphere.add( pointLight );

    scene.add( new THREE.PointLightHelper( pointLight, 5 ) ); // to remove
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createMaterial(parameters) {
    'use strict';

    material = new THREE.MeshLambertMaterial( parameters );
    lambertMaterials.push(material);
    materials.push(material);
    
    material = new THREE.MeshPhongMaterial( parameters );
    phongMaterials.push(material);

    material = new THREE.MeshToonMaterial( parameters );
    toonMaterials.push(material);

    material = new THREE.MeshBasicMaterial( parameters );
    basicMaterials.push(material);
}

function updateObjectMaterials(object, newMaterials) {
    'use strict';

    if (object instanceof THREE.Mesh) {
        object.material = newMaterials[materials.indexOf(object.material)];
    }

    for (var i = 0; i < object.children.length; i++) {
        updateObjectMaterials(object.children[i], newMaterials);
    }
}

function updateMaterials(newMaterials) { 
    'use strict';

    updateObjectMaterials(moon, newMaterials);

    for (var i = 0; i < trees.length; i++)
        updateObjectMaterials(trees[i], newMaterials);

    updateObjectMaterials(ovni, newMaterials);
    
    updateObjectMaterials(house, newMaterials);
}

function createMoon(){
    'use strict';

    // material = new THREE.MeshPhongMaterial( {color: 'palegoldenrod', 
    //     emissive: 'palegoldenrod',
    //     emissiveIntensity: 0.75,
    //     shininess: 50,
    //     specular: 'palegoldenrod', 
    //     wireframe: false} );
    // materials.push(material);

    createMaterial( {color: 'palegoldenrod', 
    emissive: 'palegoldenrod',
    emissiveIntensity: 0.75,
    shininess: 50,
    specular: 'palegoldenrod', 
    wireframe: false} );

    moon = new THREE.Mesh( new THREE.SphereGeometry( 56, 32, 16 ), materials[0] );
    moon.position.set( -200, 200, 0 );
    scene.add( moon );

    // to remove
    // var gui = new dat.GUI();
    // gui.add( material, 'emissiveIntensity', 0, 1 );
    // gui.add( material, 'shininess', 0, 100 );
    // gui.add( material, 'wireframe' );
    // gui.addColor( material, 'color' );
    // gui.addColor( material, 'emissive' );
    // gui.addColor( material, 'specular' );
}

function createTrees(){
    'use strict';

    createMaterial( {color: 'sienna', wireframe: false} );
    createMaterial( {color: 'darkgreen', wireframe: false} );
    
    var n = THREE.MathUtils.randInt(40, 80);
    for (var i = 0; i < n; i++) {
        var size = THREE.MathUtils.randFloat(0.8, 1.2);
        var x = THREE.MathUtils.randInt(-400, 400);
        var z = THREE.MathUtils.randInt(-400, 400);
        if ((x > -20 && x < 20 ) || (z > -30 && z < 30)) 
            continue;
        var orientation = THREE.MathUtils.randFloat(0, 2 * Math.PI);

        createTree( size, x, z, orientation);
    }
}

function createTree(size, x, z, orientation){
    'use strict';

    var tree = new THREE.Object3D();
    
    var rootTrunk = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 4, 64 ), materials[1] );
    rootTrunk.position.set( 0, 2, 0);
    tree.add( rootTrunk );

    var angle = Math.PI / 6;
    var radius =  2 * Math.cos(angle);
    var height = 12;
    var mainTrunk = new THREE.Mesh( new THREE.CylinderGeometry( radius, radius, height, 64 ), materials[1] );
    mainTrunk.rotation.z = angle;
    mainTrunk.position.set( 2 - (radius * Math.cos(angle) + height / 2 * Math.sin(angle)), 2 - (radius * Math.sin(angle) - height / 2 * Math.cos(angle)), 0 );
    rootTrunk.add( mainTrunk );

    var secundaryTrunk = new THREE.Mesh( new THREE.CylinderGeometry( radius / 2, radius / 2, height, 64 ), materials[1] );
    secundaryTrunk.rotation.z = Math.PI / 2 + angle;
    secundaryTrunk.position.set( 4, -2, 0 );
    mainTrunk.add( secundaryTrunk );

    var mainTop = new THREE.Mesh( new THREE.SphereGeometry( 7, 32, 16 ), materials[2] );
    mainTop.scale.set( 1, 5 / 7, 5 / 7 );
    mainTop.rotation.z = - angle;
    mainTop.position.set( 0, height / 2 + 4, 0 );
    mainTrunk.add( mainTop );

    var secundaryTop = new THREE.Mesh( new THREE.SphereGeometry( 7, 32, 16 ), materials[2] );
    secundaryTop.scale.set( 1, 5 / 7, 5 / 7 );
    secundaryTop.rotation.z = angle;
    secundaryTop.position.set( 0, - height / 2 - 4, 0 );
    secundaryTrunk.add( secundaryTop );

    var thirdTop = new THREE.Mesh( new THREE.SphereGeometry( 7, 32, 16 ), materials[2] );
    thirdTop.scale.set( 1, 5 / 7, 5 / 7 );
    thirdTop.position.set( 0, 4 + height + radius, 0 );
    rootTrunk.add( thirdTop );

    tree.scale.set(size, size, size);
    tree.rotation.y = orientation;
    tree.position.set(x, 0, z);
    trees.push(tree);
    scene.add( tree );

}

function createOvni(){
    'use strict';
    
    createMaterial( {color: 'grey', wireframe: false} );
    createMaterial( {color: 'red', wireframe: false} );
    
    ovni = new THREE.Object3D();
    ovni.userData = { xPositive: 0, xNegative: 0, zPositive: 0, zNegative: 0 };
    
    var body = new THREE.Mesh( new THREE.SphereGeometry( 28, 32, 16 ), materials[7] );
    body.scale.set(1, 4 / 28, 1);
    ovni.add( body );

    var cockpit = new THREE.Mesh( new THREE.SphereGeometry( 10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 ), materials[7] );
    ovni.add( cockpit );

    var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 6, 6, 4, 32 ), materials[7] );
    cylinder.position.set(0, - 4, 0);
    ovni.add( cylinder );

    for (var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
        var smallSphere = new THREE.Mesh( new THREE.SphereGeometry( 2, 32, 16 ), materials[8] );
        smallSphere.position.set( 18  * Math.cos(angle), - 2.75, 18 * Math.sin(angle) );
        createPointLight(smallSphere);
        ovni.add( smallSphere );
    }

    createSpotLight();
    ovni.position.set(0, 100, 0);
    scene.add(ovni);
}

function createHouse(){
    'use strict';

    createMaterial( {color: 'white', wireframe: false} );
    createMaterial( {color: 'orange', wireframe: false} );
    createMaterial( {color: 'blue', wireframe: false} );
    createMaterial( {color: 'brown', wireframe: false} );

    
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

    lSide = new THREE.Mesh( geom, materials[3] );

    house.add(lSide);

    rSide = new THREE.Mesh( geom, materials[3] );

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

    front = new THREE.Mesh( geom, materials[3] );

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

    back = new THREE.Mesh( geom, materials[3] );

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

    roof = new THREE.Mesh( geom, materials[4] );

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

    chimney = new THREE.Mesh( geom, materials[3] );

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

    windows = new THREE.Mesh( geom, materials[5] );

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

    door = new THREE.Mesh( geom, materials[6] );

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

    ovni.position.x += (ovni.userData.xPositive - ovni.userData.xNegative) * 20 * delta;
    ovni.position.z += (ovni.userData.zPositive - ovni.userData.zNegative) * 20 * delta;
    ovni.rotation.y += 0.40 * delta;

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

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.xr.enabled = true;
    document.body.appendChild( VRButton.createButton( renderer ) );

    doneGeneratingField();
    doneGeneratingSky();

    createScene();
    createCameras();
    createDirectionalLight();
    createAmbientLight();

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    renderer.setAnimationLoop( function () {

        delta = clock.getDelta();

        update();
        render();
    
    } );
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
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

        case 'D': case 'd': // toggle directionalLight
            directionalLight.visible = !directionalLight.visible;
            break;

        case 'Q': case 'q': // Gouraud shading
            updateMaterials(lambertMaterials);
            materials = lambertMaterials;
            break;
        case 'W': case 'w': // Phong shading
            updateMaterials(phongMaterials);
            materials = phongMaterials;
            break;
        case 'E': case 'e': // Toon shading
            updateMaterials(toonMaterials);
            materials = toonMaterials;
            break;
        
        case 'R': case 'r': // Deactivates illumination calculations
            updateMaterials(basicMaterials);
            materials = basicMaterials;
            break;
        
        case 'P': case 'p': // activates spotLight and pointLights
            spotLight.visible = true;
            pointLights.forEach(pointLight => {pointLight.visible = true});
            break;
        case 'S': case 's': // deactivates spotLight and pointLights
            spotLight.visible = false;
            pointLights.forEach(pointLight => {pointLight.visible = false});
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