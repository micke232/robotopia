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
var spareParts = [];
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
var Robot = "normal.png";
var RobotLeft = ["left_1.png", "left_2.png", "left_3.png", "left_4.png"];
var RobotRight = ["right_1.png", "right_2.png", "right_3.png", "right_4.png"];
var robotMaterial = THREE.ImageUtils.loadTexture("images/" + Robot);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


camera.position.z = 600;


//the robot and User

var userGeometry = new THREE.PlaneGeometry( 150, 150, 10 );
var userMaterial = new THREE.MeshBasicMaterial( {
	transparent: true,
	map: robotMaterial 
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

	userMaterial.needsUpdate = true;
	user.needsUpdate = true;
	robotMaterial.needsUpdate = true;

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
	background.position.y = camera.position.y;
	background.position.x = camera.position.x;
	//colluision detection
	var originPoint = user.position.clone();
	for (var i = 0; i < user.geometry.vertices.length; i++){

		var localVertex = user.geometry.vertices[i].clone();
		var globalVertex = localVertex.applyMatrix4(user.matrixWorld);
		var directionVector = globalVertex.sub(user.position);
		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
		var collisionResult = ray.intersectObjects(objectArray);

		if (collisionResult.length > 0 && collisionResult[0].distance < directionVector.length()){ //Det som ska hända när man träffar ett objekt !!! bug lös !!!
			inAir = false;
			spaceButton = false;
			gravity.accel = -80;
			if (collisionResult[0].object.name == "moving" && collisionResult.length > 0 && collisionResult[0].distance < directionVector.length()){
				if (!mPlatform.up){ // upp
					platformCounter += 0.01;
					mPlatform.position.y += 0.1;
					mPlatform.position.x += 0.1;
					user.position.y += 0.1;
					user.position.x += 0.1;
					console.log(user.position.x + " " + user.position.y);
					if (platformCounter > 0) mPlatform.up = true;

				}

				if (mPlatform.up){ // ner
					platformCounter -= 0.01;
					mPlatform.position.y -= 0.1;
					mPlatform.position.x -= 0.1;
					user.position.y -= 0.1;
					user.position.x -= 0.1;
					console.log(user.position.x + " " + user.position.y);
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
		robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotLeft[0]);
		console.log(RobotLeft[0]);
		RobotLeft.push(RobotLeft.shift());
	}
	if (holdRight == true){
		user.position.x += 7;
		robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotRight[0]);
		console.log(RobotRight[0]);
		RobotRight.push(RobotRight.shift());
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
	//moving platforms



	render();
}
animate();

