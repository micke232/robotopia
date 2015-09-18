var KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_ENTER = 13;
var KEYCODE_SHIFT = 16;
var pickUp = document.getElementById("pickUp");
var holdLeft = false;
var holdRight = false;
var holdShift = false;
var spaceButton = false;
var jumpHight = 250;
var inAir = true;
var objectArray = [];
var rain = [];
var inventory = [];
var sparePartArray = [];
var platformCounter = 0;
var jumpCounter = 0;
// sparecounter gets plus one if a sparepart has been picked.
// if that happens it gets the id of counter and adds the counternumber to it
var spareCounter = 0;
var countSparepart = document.getElementById("counter");
var sprite = {
	jumping: false,
	jumpSpeed: 10,
	height: 50,
	doubleJump: false,
	speedBoost: false,
	airFloat: false,
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

//the robot and User

var Robot = "normal.png";
var RobotLeft = ["left_1.png", "left_2.png", "left_3.png", "left_4.png"];
var RobotRight = ["right_1.png", "right_2.png", "right_3.png", "right_4.png"];
var robotMaterial = THREE.ImageUtils.loadTexture("images/" + Robot);
robotMaterial.minFilter = THREE.LinearFilter;

// user created
var userGeometry = new THREE.PlaneGeometry( 100, 100, 10);

var userMaterial = new THREE.MeshPhongMaterial({
	transparent: true,
	map: robotMaterial 
});
var user = new THREE.Mesh( userGeometry, userMaterial );
user.position.y = sprite.y;
user.minFilter = THREE.LinearFilter;
scene.add(user);




function jump(){

	if (sprite.jumping == false && inAir == false){
		gravity.accel += 1;
		gravity.posY = user.position.y;
		sprite.jumping = true;
	}


}


document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
var spriteCounter = 0;
function keyDown(e){

	switch(e.keyCode){//space
		case KEYCODE_SPACE:
			if (spaceButton == false) jump(); //Kollar så space inte redan är tryckt
			spaceButton = true;
			//			jumpCounter += 1;
			//			console.log(jumpCounter);
			//			console.log(sprite.jumping);
			break;
		case KEYCODE_LEFT:
			holdLeft = true;

			break;
		case KEYCODE_RIGHT:
			holdRight = true;

			break;
		case KEYCODE_ENTER:
			checkCollision();
			break;

		case KEYCODE_SHIFT:
			holdShift = true;
			break;
	}



};
var normal = true;
function keyUp(e){
	switch(e.keyCode){//space
		case KEYCODE_LEFT:
			holdLeft = false;
			break;
		case KEYCODE_RIGHT:
			holdRight = false;
			break;
		case KEYCODE_SHIFT:
			holdShift = false;
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
  if (user.position.y < -1000){ //when you die, reload page
		location.reload();
	}
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
	//	if (jumpCounter < 2){

	//	}
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

	if (holdLeft){
		if (holdShift && sprite.speedBoost) user.position.x -= 14;
		else user.position.x -= 7;
		robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotLeft[0]);
		user.material.map = robotMaterial;
		user.material.needsUpdate = true;


		RobotLeft.push(RobotLeft.shift());
	}
	if (holdRight){
		if (holdShift && sprite.speedBoost) user.position.x += 14;
		else user.position.x += 7;
		robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotRight[0]);
		user.material.map = robotMaterial;
		user.material.needsUpdate = true;

		RobotRight.push(RobotRight.shift());
	}
	// check if hit object


	//rain
	for (var i = 0; i < rain.length; i++){
		rain[i].position.y -= 15;
		rain[i].position.x -= 3;

		if (rain[i].position.y < -500){
			rain[i].position.y = 1000;
			rain[i].position.x = randomGenerator();
		}
	}

	render();
}

function checkCollision(){
	for (var i = 0; i < sparePartArray.length; i++){
		if (user.position.x >= sparePartArray[i].position.x - 50 && user.position.x <= sparePartArray[i].position.x + 50 && user.position.y >= sparePartArray[i].position.y - 50 && user.position.y <= sparePartArray[i].position.y + 50){ // lång if ZZzzz
			if (sparePartArray[i].name == "one") sprite.speedBoost = true;
			spareCounter++;
			countSparepart.innerHTML = spareCounter;
			pickUp.innerHTML = "You picked up the speed boost, hold down shift and run superduperfast!"
			var deletObject = sparePartArray[i];
			inventory.push(sparePartArray[i]);
			sparePartArray.splice(i,1);
			for (var j = 0; j < scene.children.length; j++){
				if (deletObject.name == scene.children[j].name){ // fan ta scene.children!
					scene.remove(scene.children[j]);
				}
			};
		}
	}

};
animate();


