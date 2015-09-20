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
var doubleJump = true;
var jumpHight = 250;
var inAir = true;
var objectArray = [];
var rain = [];
var cloudArray = [];
var inventory = [];
var sparePartArray = [];
var platformCounter = 0;
var jumpCounter = 0;
var spriteCounter = 0;
// sparecounter gets plus one if a sparepart has been picked.
// if that happens it gets the id of counter and adds the counternumber to it
var spareCounter = 0;
var countSparepart = document.getElementById("counter");
var part1 = document.getElementById("part1");
var part2 = document.getElementById("part2");
var part3 = document.getElementById("part3");
var part4 = document.getElementById("part4");

var sprite = {
	normalSpeed: 10, //movespeed on sprite
	boostSpeed: 5, //movespeed on sprite when boosted
	jumping: false,
	jumpSpeed: 10,
	height: 100,
	doubleJump: false,
	speedBoost: false,
	airFloat: false,
	x: NaN,
	y: 150 //startposition
};

var gravity = {
	posY: 0,
	velocity: 30, //Velocity
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


camera.position.z = 400;

//the robot and User

var RobotFront = "normal.png";
var RobotLeft = ["left_1.png", "left_2.png", "left_3.png", "left_4.png"];
var RobotRight = ["right_1.png", "right_2.png", "right_3.png", "right_4.png"];
var robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotFront);
robotMaterial.minFilter = THREE.LinearFilter;

// user created
var userGeometry = new THREE.PlaneGeometry( sprite.height, 100, 10);
var userMaterial = new THREE.MeshPhongMaterial({
	transparent: true,
	map: robotMaterial 
});
var user = new THREE.Mesh( userGeometry, userMaterial );
user.position.y = sprite.y;
user.minFilter = THREE.LinearFilter;
scene.add(user);


document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function jump(){
	if ((sprite.jumping == false && inAir == false ) || doubleJump){
		gravity.accel = -80;
		gravity.posY = user.position.y;
		sprite.jumping = true;
		if (inAir) doubleJump = false;
	}
}



function keyDown(e){
	switch(e.keyCode){//space
		case KEYCODE_SPACE:
			if (!spaceButton || sprite.doubleJump){ //Check if spacebutton is pushed or not
				spaceButton = true;
				jump();
			}

			break;
		case KEYCODE_LEFT:
			holdLeft = true;

			break;
		case KEYCODE_RIGHT:
			holdRight = true;

			break;
		case KEYCODE_ENTER:
			checkCollision();
			if (inventory.length > 3) theEnd();
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


var frameCounter = 0;
setInterval(function(){frameCounter = 0;}, 1000)
function animate(){

	frameCounter++;

	requestAnimationFrame( animate );
	//	setTimeout(function(){requestAnimationFrame( animate );}, 500);
	camera.position.x = user.position.x;
	camera.position.y = user.position.y;
	background.position.y = camera.position.y + 200;
	background.position.x = camera.position.x;
	sun.rotation.z += 0.01;
	//colluision detection
	if (user.position.y < -600){ //when you die, reload page
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
			var platformPosY = parseInt(collisionResult[0].point.y, 10);
			var userPosY = (parseInt(user.position.y - (sprite.height / 2), 10));
			if (!sprite.jumping && collisionResult[0] && (platformPosY >= (userPosY - 10) || platformPosY <= (userPosY + 10))) spaceButton = false;

			gravity.accel = -80;
			doubleJump = true;

			//moving platform
			if (collisionResult[0].object.name == "moving" && collisionResult.length > 0 && collisionResult[0].distance < directionVector.length()){
				if (!mPlatform.up){ // Down
					platformCounter += 0.01;
					mPlatform.position.y += 0.1;
					mPlatform.position.x += 0.1;
					fixMovingPlatform.position.y += 0.1;
					fixMovingPlatform.position.x += 0.1;
					user.position.y += 0.1;
					user.position.x += 0.1;
					if (platformCounter > 0) mPlatform.up = true;

				}

				if (mPlatform.up){ // Up
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
	if (sprite.jumping == false){ //Falls
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
		var moveSpeedLeft = sprite.normalSpeed;
		if (holdShift && sprite.speedBoost){
			moveSpeedLeft = sprite.boostSpeed;
			user.position.x -= 14;
		}
		else user.position.x -= 7;
		robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotLeft[0]);
		user.material.map = robotMaterial;
		user.material.needsUpdate = true;


		if (frameCounter % moveSpeedLeft == 0) RobotLeft.push(RobotLeft.shift());
	}

	if (holdRight){
		var moveSpeedRight = sprite.normalSpeed;
		if (holdShift && sprite.speedBoost){
			moveSpeedRight = sprite.boostSpeed;
			user.position.x += 14;
		}
		else user.position.x += 7;
		robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotRight[0]);
		user.material.map = robotMaterial;
		user.material.needsUpdate = true;

		if (frameCounter % moveSpeedRight == 0) RobotRight.push(RobotRight.shift());
	}

	if (!holdRight && !holdLeft) {
		robotMaterial = THREE.ImageUtils.loadTexture("images/" + RobotFront);
		user.material.map = robotMaterial;
		user.material.needsUpdate = true;
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

	for (var i = 0; i < cloudArray.length; i++){

		cloudArray[i].position.x -= 1;

		if (cloudArray[i].position.x < -800){

			cloudArray[i].position.x = 3800;
		}
	}

	render();
}

countSparepart.innerHTML = spareCounter;

function checkCollision(){
	for (var i = 0; i < sparePartArray.length; i++){
		if (user.position.x >= sparePartArray[i].position.x - 50 && user.position.x <= sparePartArray[i].position.x + 50 && user.position.y >= sparePartArray[i].position.y - 50 && user.position.y <= sparePartArray[i].position.y + 50){ // Long if ZZzzz
			if (sparePartArray[i].name == "one") {
				sprite.speedBoost = true;
				spareCounter++;
				countSparepart.innerHTML = spareCounter;
				part1.classList.add("showPart");
				pickUp.innerHTML = "You got some wheels, hold down shift and run superduperfast!";
			}
			if (sparePartArray[i].name == "two") {
				sprite.doubleJump = true;
				spareCounter++;
				countSparepart.innerHTML = spareCounter;
				part2.classList.add("showPart");
				pickUp.innerHTML = "Those arms looks strong, Now dubbeljump!";
			}
			if (sparePartArray[i].name == "three") {
				spareCounter++;
				countSparepart.innerHTML = spareCounter;
				part3.classList.add("showPart");
				pickUp.innerHTML = "You're smart as a lightbulb!";
			}
			if (sparePartArray[i].name == "four") {
				spareCounter++;
				countSparepart.innerHTML = spareCounter;
				part4.classList.add("showPart");
				pickUp.innerHTML = "You got all the parts, go find you´r friend!";
			}
			if (sparePartArray[i].name == "five") {
				countSparepart.innerHTML = spareCounter;
				pickUp.innerHTML = "You found him! You both lived happily ever after";
				camera.position.z = 200; //zoom in when you win!
			}
			var deletObject = sparePartArray[i];
			inventory.push(sparePartArray[i]);
			sparePartArray.splice(i,1);
			for (var j = 0; j < scene.children.length; j++){
				if (deletObject.name == scene.children[j].name){ // Fuck this scene.children!
					scene.remove(scene.children[j]);
				}
			};
		}
	}

};
animate();


