class TexturesGenerator{

    renderer; camera; scene;

    pixelRatio = window.devicePixelRatio;
	textureSize = 128 * this.pixelRatio;

    geometry; mesh;

    materials = [
        new THREE.MeshBasicMaterial({color: 'white'}),
        new THREE.MeshBasicMaterial({color: 'yellow'}),
        new THREE.MeshBasicMaterial({color: 'purple'}),
        new THREE.MeshBasicMaterial({color: 'lightblue'}),
    ];

    constructor(){
        'use strict';

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        // this.renderer.setSize(this.textureSize, this.textureSize);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 1);
    }

    createField(){
        'use strict';

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('lightgreen');

        this.scene.add(new THREE.AxesHelper(50));

        const n = Math.floor(Math.random() * (1000 - 500)) + 500;
        console.log(n);
        for (var i = 0; i < n; i++){
            this.geometry = new THREE.CircleGeometry( 1, 32 );
            this.mesh = new THREE.Mesh( this.geometry, this.materials[Math.floor(Math.random() * this.materials.length)] );
            this.mesh.position.set(Math.random() * window.innerWidth - window.innerWidth / 2 , Math.random() * window.innerHeight - window.innerHeight / 2, 0);
            this.scene.add( this.mesh );
        }
    }

    generateFieldTexture(){
        'use strict';

        // instantiate a framebuffer texture
        this.frameTexture = new THREE.FramebufferTexture( this.textureSize, this.textureSize, THREE.RGBAFormat );
        
        // calculate start position for copying part of the frame data
        this.vector = new THREE.Vector2();
        this.vector.x = ( window.innerWidth * this.pixelRatio / 2 ) - ( this.textureSize / 2 );
        this.vector.y = ( window.innerHeight * this.pixelRatio / 2 ) - ( this.textureSize / 2 );
        // this.vector.x = 0;
        // this.vector.y = 0;


        // render the scene
        renderer.clear();
        this.createField();
        renderer.render( this.scene, this.camera );

        // copy part of the rendered frame into the framebuffer texture
	    renderer.copyFramebufferToTexture( this.vector, this.frameTexture );

        return this.frameTexture;
    }
};

// //////////////////////
// /* GLOBAL VARIABLES */
// //////////////////////

// var _camera, _scene, _renderer;

// var _geometry, _material, _mesh;

// const materials = [
//     new THREE.MeshBasicMaterial({color: 'white'}),
//     new THREE.MeshBasicMaterial({color: 'yellow'}),
//     new THREE.MeshBasicMaterial({color: 'purple'}),
//     new THREE.MeshBasicMaterial({color: 'lightblue'}),
// ];

// const pixelRatio = window.devicePixelRatio;
// const textureSize = 128 * pixelRatio * 2;

// // calculate start position for copying part of the frame data
// const vector = new THREE.Vector2();
// vector.x = ( window.innerWidth * pixelRatio / 2 ) - ( textureSize / 2 );
// vector.y = ( window.innerHeight * pixelRatio / 2 ) - ( textureSize / 2 );

// /////////////////////
// /* CREATE SCENE(S) */
// /////////////////////
// function createField(){
//     'use strict';

//     _scene = new THREE.Scene();
//     _scene.background = new THREE.Color('lightgreen');

//     _scene.add(new THREE.AxesHelper(50));

//     const n = Math.floor(Math.random() * (1000 - 500)) + 500;
//     console.log(n);
//     for (var i = 0; i < n; i++){
//         _material = new THREE.MeshBasicMaterial({color: 0xff0000});
//         _geometry = new THREE.CircleGeometry( 1, 32 );
//         _mesh = new THREE.Mesh( _geometry, materials[Math.floor(Math.random() * materials.length)] );
//         _mesh.position.set(Math.random() * textureSize - textureSize / 2 , Math.random() * textureSize - textureSize / 2, 0);
//         _scene.add( _mesh );
//     }
// }

// //////////////////////
// /* CREATE _CAMERA(S) */
// //////////////////////

// function createCamera(){
//     'use strict';

//     _camera = new THREE.OrthographicCamera(textureSize / -2, textureSize / 2, textureSize / 2, textureSize / -2, 0, 1);


//     // _camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
//     // _camera.position.set(70, 70, 70);
//     // _camera.lookAt(0, 0, 0);

//     // const controls = new THREE.OrbitControls( _camera, _renderer.domElement );
//     // controls.minDistance = 20;
//  	// controls.maxDistance = 1000;
// }

// /////////////////////
// /* CREATE LIGHT(S) */
// /////////////////////

// ////////////////////////
// /* CREATE OBJECT3D(S) */
// ////////////////////////



// /////////////
// /* DISPLAY */
// /////////////
// function render() {
//     'use strict';

//     _renderer.render(scene, _camera);
// }

// ////////////////////////////////
// /* INITIALIZE ANIMATION CYCLE */
// ////////////////////////////////
// function init() {
//     'use strict';

//     _renderer = new THREE.WebGLRenderer({
//         antialias: true
//     });
//     _renderer.setSize(textureSize, textureSize);
//     document.body.appendChild(_renderer.domElement); 

//     createCamera();
//     generateFieldTexture();

//     // use dat.GUI
//     var gui = new dat.GUI();
//     gui.add(_camera, 'far', -1, 100).onChange(function (value) {_camera.updateProjectionMatrix();});
// }


// function generateFieldTexture(){
//     'use strict';

//     // instantiate a framebuffer texture
// 	const frameTexture = new THREE.FramebufferTexture( textureSize, textureSize, THREE.RGBAFormat );

//     // calculate start position for copying part of the frame data
// 	const vector = new THREE.Vector2();
// 	vector.x = ( window.innerWidth * pixelRatio / 2 ) - ( textureSize / 2 );
// 	vector.y = ( window.innerHeight * pixelRatio / 2 ) - ( textureSize / 2 );
    
//     // render the scene
// 	_renderer.clear();
//     createField();
// 	_renderer.render( _scene, _camera );

//     // copy part of the rendered frame into the framebuffer texture
// 	_renderer.copyFramebufferToTexture( vector, frameTexture );
// }

// function animate() {
//     'use strict';

//     requestAnimationFrame(animate);

//     _renderer.render( _scene, _camera );
// }

