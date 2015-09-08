var KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var holdLeft = false;
var holdRight = false;
var gravity = 1;
var jumpHight = 0;
var sprite = {
	jumping: false,
	jumpSpeed: 10,
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
		sprite.jumping = true;
	}
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e){
	console.log(e.keyCode);
	switch(e.keyCode){//space
		case KEYCODE_SPACE:
			jump();
			break;
		case KEYCODE_LEFT:
			holdLeft = true;
			break;
		case KEYCODE_RIGHT:
			holdRight = true;
			break;
	}
};

function keyUp(e){

	switch(e.keyCode){//space
		case KEYCODE_SPACE:
			jump();
			break;
		case KEYCODE_LEFT:
			holdLeft = false;
			break;
		case KEYCODE_RIGHT:
			holdRight = false;
			break;

	}
};

function render() {
	renderer.render( scene, camera );
};



function animate(){
	requestAnimationFrame( animate );


	if (sprite.jumping == true && jumpHight <= 50){
		jumpHight +=2;
		user.position.y += sprite.jumpSpeed;

		if (jumpHight == 50){
			sprite.jumping = false;

		}
	}

	if (sprite.jumping == false){
		if (user.position.y <= (cube.position.y + sprite.height)){
		}
		else user.position.y -= sprite.jumpSpeed;

		jumpHight = 0;
	}

	if (holdLeft == true){
		user.position.x -= 5;
	}

	if (holdRight == true){
		user.position.x += 5;
	}


	render();
}
animate();
