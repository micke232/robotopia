var KEYCODE_SPACE = 32;

var gravity = 1;
var jumpHight = 0;
var sprite = {
	jumping: false,
	height: 50,
	x: NaN,
	y: 50
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 200, 10, 50 );
var material = new THREE.MeshBasicMaterial( {
	color: 0x00ff00
} );

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 200;
camera.position.y = 100;

var userGeometry = new THREE.BoxGeometry( 50, 100, 1 );
var userMaterial = new THREE.MeshBasicMaterial( {
	color: "red"
} );
var user = new THREE.Mesh( userGeometry, userMaterial );
user.position.y = sprite.y;
scene.add(user);


function jump(){
	if (sprite.jumping == false){
		sprite.y += 50;
		sprite.jumping = true;
		console.log(sprite.y);
	}
}

document.addEventListener("keydown", keyDown);

function keyDown(e){
					switch(32){//space
						case KEYCODE_SPACE:
							jump();
							break;
					}
};

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
};



function animate(){
	requestAnimationFrame( animate );


		if (sprite.jumping == true && jumpHight <= 50){
			jumpHight +=1;
			user.position.y += 2;
			console.log(jumpHight);
			if (jumpHight == 50){
				sprite.jumping = false;
				console.log(sprite.jumping);
			}
		}

	if (sprite.jumping == false){
		if (user.position.y <= (cube.position.y + sprite.height)){
		}
		else user.position.y -= 2;

		jumpHight = 0;
	}


	render();
}
animate();
