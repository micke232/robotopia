var KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var holdLeft = false;
var holdRight = false;
var spaceButton = false;
var jumpHight = 200;
var inAir = true;
var objectArray = [];

var sprite = {
	jumping: false,
	jumpSpeed: 10,
	height: 50,
	x: NaN,
	y: 100 //startposition
};

var gravity = {
	posY: 0,
	velocity: 25, //hastighet
	mass: 25,
	accel: -80,
	jumping: inAir,
	max: false
};


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 50, 10, 50 );
var material = new THREE.MeshBasicMaterial( {
	color: 0x00ff00
} );

var cube = new THREE.Mesh( geometry, material );
objectArray.push(cube);
scene.add( cube );

camera.position.z = 400;
camera.position.y = 100;

var userGeometry = new THREE.PlaneGeometry( 50, 100, 10 );
var userMaterial = new THREE.MeshBasicMaterial( {
	color: "red"
} );
var user = new THREE.Mesh( userGeometry, userMaterial );
user.position.y = sprite.y;
scene.add(user);


function jump(){
	if (sprite.jumping == false && inAir == false){
		gravity.accel = 1;
		gravity.posY = user.position.y;
		sprite.jumping = true;
	}
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e){

	switch(e.keyCode){//space
		case KEYCODE_SPACE:
			if (spaceButton == false) jump(); //Kollar så space inte redan är tryckt
			spaceButton = true;
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

	camera.position.x = user.position.x;
	camera.position.y = user.position.y;
	//colluision detection
	var originPoint = user.position.clone();
	for (var i = 0; i < user.geometry.vertices.length; i++){

		var localVertex = user.geometry.vertices[i].clone();
		var globalVertex = localVertex.applyMatrix4(user.matrixWorld);
		var directionVector = globalVertex.sub(user.position);

		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

		var collisionResult = ray.intersectObjects(objectArray);

		if (collisionResult.length > 0 && collisionResult[0].distance < directionVector.length()){ //Det som ska hända när man träffar ett objekt
			inAir = false;
			spaceButton = false;
			gravity.accel = -80;

		}
		else inAir = true;
	};



	if (sprite.jumping == true && gravity.posY + jumpHight > user.position.y){

		user.position.y -= (gravity.velocity * gravity.mass) / gravity.accel;

			gravity.accel += 1;



		if (gravity.posY + jumpHight < user.position.y){
      console.log(gravity.accel);
			gravity.accel = -80;
			sprite.jumping = false;
		}
	}


	if (sprite.jumping == false){ //faller
		if (inAir){
			user.position.y += (gravity.velocity * gravity.mass) / gravity.accel;
			if (gravity.max == false){
				gravity.accel += 1;
			}
			if (gravity.accel > -2) {
				gravity.max = true;

			}
		}
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
