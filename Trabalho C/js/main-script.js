//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

var texturesGenerator = new TexturesGenerator();
var frameTexture;

var ovni, cylinder;

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
function createSpotLight() {
    'use strict';

    spotLight = new THREE.SpotLight( 0xffffff, spotLightIntensity, 0, Math.PI / 6, 0 );
    ovni.add( spotLight );

    var targetObject = new THREE.Object3D();
    targetObject.position.set( ovni.position.x, 0, ovni.position.z );
    ovni.add(targetObject);

    spotLight.target = targetObject;

    scene.add( new THREE.SpotLightHelper( spotLight ) ); // to remove

}

function createPointLight(smallSphere) {
    'use strict';

    var pointLight = new THREE.PointLight( 0xff0000, pointLightIntensity );
    pointLights.push( pointLight );
    smallSphere.add( pointLight );

    scene.add( new THREE.PointLightHelper( pointLight, 5 ) ); // to remove
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createOvni(){
    'use strict';
    
    material = new THREE.MeshPhongMaterial( {color: 'grey', wireframe: true} );
    
    var body = new THREE.Mesh( new THREE.SphereGeometry( 28, 32, 16 ), material );
    body.scale.set(1, 4 / 28, 1);
    ovni.add( body );

    var cockpit = new THREE.Mesh( new THREE.SphereGeometry( 10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 ), material );
    ovni.add( cockpit );

    cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 6, 6, 4, 32 ), material );
    cylinder.position.set(0, - 4, 0);
    ovni.add( cylinder );

    material = new THREE.MeshPhongMaterial( {color: 'red', wireframe: true} );

    for (var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
        var smallSphere = new THREE.Mesh( new THREE.SphereGeometry( 2, 32, 16 ), material );
        smallSphere.position.set( 18  * Math.cos(angle), - 2.75, 18 * Math.sin(angle) );
        createPointLight(smallSphere);
        ovni.add( smallSphere );
    }

    createSpotLight();
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

        case 'P': case 'p': // activates spotLight and pointLights
            spotLight.intensity = spotLightIntensity;
            pointLights.forEach(pointLight => {pointLight.intensity = pointLightIntensity});
            break;
        case 'S': case 's': // deactivates spotLight and pointLights
            spotLight.intensity = 0;
            pointLights.forEach(pointLight => {pointLight.intensity = 0});
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