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

var lSide, rSide, front, back, roof, chimney, windows, door, house;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    scene.add(new THREE.AxesHelper(100));

    geometry = new THREE.PlaneGeometry( 128*2, 128*2 );

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

    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

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

    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

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

    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

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

    const material = new THREE.MeshBasicMaterial( { color: 'brown'});

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

    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 });

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

    const material = new THREE.MeshBasicMaterial( { color: 'blue' } );

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

    const material = new THREE.MeshBasicMaterial( { color: 'brown' } );

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

    ovni.position.x += (ovni.userData.xPositive - ovni.userData.xNegative) * 20 * delta;
    ovni.position.z += (ovni.userData.zPositive - ovni.userData.zNegative) * 20 * delta;
    //ovni.rotation.y += 0.01;
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
    createCameras();
    createLights();

    createHouse();

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

    render();
    update();
    
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