//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var moon;

var ovni;

var directionalLight, directionalLightIntensity = 0.5;
var spotLight, spotLightIntensity = 0.8;
var pointLights = [], pointLightIntensity = 0.25;

var clock, delta;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    scene.add(new THREE.AxesHelper(100));

    geometry = new THREE.PlaneGeometry( 128*8, 128*8 );

    // frameTexture = texturesGenerator.generateFieldTexture();
    // material = new THREE.MeshBasicMaterial( { map: frameTexture });

    material = new THREE.MeshPhongMaterial( { color: 'green' });

    mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = - Math.PI / 2;

    scene.add( mesh );

    createMoon();

    createTrees();

    createOvni();

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras(){
    'use strict';

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
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
function createMoon(){
    'use strict';

    material = new THREE.MeshPhongMaterial( {color: 'palegoldenrod', 
        emissive: 'palegoldenrod',
        emissiveIntensity: 0.75,
        shininess: 50,
        specular: 'palegoldenrod', 
        wireframe: false} );

    moon = new THREE.Mesh( new THREE.SphereGeometry( 56, 32, 16 ), material );
    moon.position.set( -200, 200, 0 );
    scene.add( moon );

    // to remove
    var gui = new dat.GUI();
    gui.add( material, 'emissiveIntensity', 0, 1 );
    gui.add( material, 'shininess', 0, 100 );
    gui.add( material, 'wireframe' );
    gui.addColor( material, 'color' );
    gui.addColor( material, 'emissive' );
    gui.addColor( material, 'specular' );
}

function createTrees(){
    'use strict';

    var n = THREE.MathUtils.randInt(40, 80);
    for (var i = 0; i < n; i++) {
        var size = THREE.MathUtils.randFloat(1, 1.5);
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
    
    material = new THREE.MeshLambertMaterial( {color: 'sienna', wireframe: false} );

    var rootTrunk = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 4, 64 ), material );
    rootTrunk.position.set( 0, 2, 0);
    tree.add( rootTrunk );

    material = new THREE.MeshLambertMaterial( {color: 'sienna', wireframe: false} );

    var angle = Math.PI / 6;
    var radius =  2 * Math.cos(angle);
    var height = 12;
    var mainTrunk = new THREE.Mesh( new THREE.CylinderGeometry( radius, radius, height, 64 ), material );
    mainTrunk.rotation.z = angle;
    mainTrunk.position.set( 2 - (radius * Math.cos(angle) + height / 2 * Math.sin(angle)), 2 - (radius * Math.sin(angle) - height / 2 * Math.cos(angle)), 0 );
    rootTrunk.add( mainTrunk );

    var secundaryTrunk = new THREE.Mesh( new THREE.CylinderGeometry( radius / 2, radius / 2, height, 64 ), material );
    secundaryTrunk.rotation.z = Math.PI / 2 + angle;
    secundaryTrunk.position.set( 4, -2, 0 );
    mainTrunk.add( secundaryTrunk );

    material = new THREE.MeshLambertMaterial( {color: 'darkgreen', wireframe: false} );

    var mainTop = new THREE.Mesh( new THREE.SphereGeometry( 7, 32, 16 ), material );
    mainTop.scale.set( 1, 5 / 7, 5 / 7 );
    mainTop.rotation.z = - angle;
    mainTop.position.set( 0, height / 2 + 4, 0 );
    mainTrunk.add( mainTop );

    var secundaryTop = new THREE.Mesh( new THREE.SphereGeometry( 7, 32, 16 ), material );
    secundaryTop.scale.set( 1, 5 / 7, 5 / 7 );
    secundaryTop.rotation.z = angle;
    secundaryTop.position.set( 0, - height / 2 - 4, 0 );
    secundaryTrunk.add( secundaryTop );

    var thirdTop = new THREE.Mesh( new THREE.SphereGeometry( 7, 32, 16 ), material );
    thirdTop.scale.set( 1, 5 / 7, 5 / 7 );
    thirdTop.position.set( 0, 4 + height + radius, 0 );
    rootTrunk.add( thirdTop );

    tree.scale.set(size, size, size);
    tree.rotation.y = orientation;
    tree.position.set(x, 0, z);
    scene.add( tree );

}

function createOvni(){
    'use strict';
    
    ovni = new THREE.Object3D();
    ovni.userData = { xPositive: 0, xNegative: 0, zPositive: 0, zNegative: 0 };
    
    material = new THREE.MeshPhongMaterial( {color: 'grey', wireframe: false} );
    
    var body = new THREE.Mesh( new THREE.SphereGeometry( 28, 32, 16 ), material );
    body.scale.set(1, 4 / 28, 1);
    ovni.add( body );

    var cockpit = new THREE.Mesh( new THREE.SphereGeometry( 10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 ), material );
    ovni.add( cockpit );

    var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 6, 6, 4, 32 ), material );
    cylinder.position.set(0, - 4, 0);
    ovni.add( cylinder );

    material = new THREE.MeshPhongMaterial( {color: 'red', wireframe: false} );

    for (var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
        var smallSphere = new THREE.Mesh( new THREE.SphereGeometry( 2, 32, 16 ), material );
        smallSphere.position.set( 18  * Math.cos(angle), - 2.75, 18 * Math.sin(angle) );
        createPointLight(smallSphere);
        ovni.add( smallSphere );
    }

    createSpotLight();
    ovni.position.set(0, 100, 0);
    scene.add(ovni);
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
    createDirectionalLight();
    createAmbientLight();

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

        case 'D': case 'd': // toggle directionalLight
            directionalLight.visible = !directionalLight.visible;

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