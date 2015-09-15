var KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var holdLeft = false;
var holdRight = false;
var spaceButton = false;
var jumpHight = 250;
var inAir = true;
var objectArray = [];
var rain = [];
var inventory = [];
var sparePartArray = [];
var platformCounter = 0;
var sprite = {
	jumping: false,
	jumpSpeed: 10,
	height: 50,
	x: NaN,
	y: 80 //startposition
};

var gravity = {
	posY: 0,
	velocity: 30, //hastighet
	mass: 25,
	accel: -80,
	jumping: inAir,
	max: false
};


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


camera.position.z = 600;

// user created
var userGeometry = new THREE.PlaneGeometry( 100, 100, 10);
var userMaterial = new THREE.MeshBasicMaterial( {
	transparent: true,
	map: THREE.ImageUtils.loadTexture("images/normal.png")
} );
var user = new THREE.Mesh( userGeometry, userMaterial );
user.needsUpdate = true;
user.position.y = sprite.y;
scene.add(user);



document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
var spriteCounter = 0;
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



			renderer.render( scene, camera );
			spriteCounter += 1;
			if (spriteCounter == 3)
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
	background.position.y = camera.position.y + 200;
	background.position.x = camera.position.x;
	//colluision detection

	var originPoint = user.position.clone();
	for (var i = 0; i < user.geometry.vertices.length; i++){

		var localVertex = user.geometry.vertices[i].clone();
		var globalVertex = localVertex.applyMatrix4(user.matrixWorld);
		var directionVector = globalVertex.sub(user.position);
		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
		var collisionResult = ray.intersectObjects(objectArray);

		if (collisionResult.length > 0 && collisionResult[0].distance < directionVector.length()){ //Det som ska hända när man träffar ett objekt !!! bug löst med fulhack, letar fortfarande efter en bättre lösning !!!
			inAir = false;
			spaceButton = false;
			gravity.accel = -80;
			//moving platform
			if (collisionResult[0].object.name == "moving" && collisionResult.length > 0 && collisionResult[0].distance < directionVector.length()){
				if (!mPlatform.up){ // upp
					platformCounter += 0.01;
					mPlatform.position.y += 0.1;
					mPlatform.position.x += 0.1;
					fixMovingPlatform.position.y += 0.1;
					fixMovingPlatform.position.x += 0.1;
					user.position.y += 0.1;
					user.position.x += 0.1;
					if (platformCounter > 0) mPlatform.up = true;

				}

				if (mPlatform.up){ // ner
					platformCounter -= 0.01;
					mPlatform.position.y -= 0.1;
					mPlatform.position.x -= 0.1;
					fixMovingPlatform.position.y -= 0.1;
					fixMovingPlatform.position.x -= 0.1;
					user.position.y -= 0.1;
					user.position.x -= 0.1;
					if (platformCounter < - 50) mPlatform.up = false;

				}
			}


		}
		else inAir = true;
	};

	if (sprite.jumping == true && gravity.posY + jumpHight > user.position.y){
		user.position.y -= (gravity.velocity * gravity.mass) / gravity.accel;
		gravity.accel += 1;
		if (gravity.posY + jumpHight < user.position.y){
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
		user.position.x -= 7;
	}
	if (holdRight == true){
		user.position.x += 7;
	}

	//rain
	for (var i = 0; i < rain.length; i++){
		rain[i].position.y -= 15;
		rain[i].position.x -= 3;

		if (rain[i].position.y < -1000){
			rain[i].position.y = 1000;
			rain[i].position.x = randomGenerator();
		}
	}

	//pick up sparepart



	render();
}

animate();


