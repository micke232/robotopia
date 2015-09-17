var mPlatform;
var fixMovingPlatform;
var sparePartTextures = [THREE.ImageUtils.loadTexture("images/sparepart.png")];
var createObject = {
	smallPlatform: { //g = geometry
		gx: 200,
		gy: 20,
		gz: 30,
		fx: 50,
		fy: 20,
		fz: 30,
		create: function(posX,posY){
			var smallGeometry = new THREE.BoxGeometry( this.gx, this.gy, this.gz );
			var smallMaterial = new THREE.MeshPhongMaterial( {
				map: THREE.ImageUtils.loadTexture("images/platform.jpg"),
			});
			var smallPlatform = new THREE.Mesh(smallGeometry, smallMaterial);
			smallPlatform.position.x = posX;
			smallPlatform.position.y = posY;
			objectArray.push(smallPlatform);
			scene.add(smallPlatform);
			fulHack(posX,posY,this.fx,this.fy,this.fz);
		}
	},

	largePlatform: { //g = geometry
		gx: 400,
		gy: 20,
		gz: 50,
		fx: 50,
		fy: 20,
		fz: 50,
		create: function(posX,posY){
			var largeGeometry = new THREE.BoxGeometry( this.gx, this.gy, this.gz );
			var largeMaterial = new THREE.MeshPhongMaterial( {
				map: THREE.ImageUtils.loadTexture("images/platform.jpg"),
			});
			var largePlatform = new THREE.Mesh( largeGeometry, largeMaterial );
			largePlatform.position.x = posX;
			largePlatform.position.y = posY;
			largePlatform.name = "kek";
			objectArray.push(largePlatform);
			scene.add(largePlatform);
			var posXfix = posX + 100;
			fulHack(posXfix,posY,this.fx,this.fy,this.fz);
		}
	},

	movingPlatform: {
		gx: 200,
		gy: 20,
		gz: 30,
		fx: 50,
		fy: 20,
		fz: 30,
		name: "moving",
		create: function(posX,posY){
			var movingGeometry = new THREE.BoxGeometry(this.gx, this.gy, this.gz);
			var movingMaterial = new THREE.MeshPhongMaterial( {
				color: "yellow",
				map: THREE.ImageUtils.loadTexture("images/platform.jpg"),
			});
			mPlatform = new THREE.Mesh(movingGeometry, movingMaterial);
			mPlatform.position.x = posX;
			mPlatform.position.y = posY;
			mPlatform.up = true;
			mPlatform.name = this.name;
			objectArray.push(mPlatform);
			scene.add(mPlatform);
			fulHackMoving(posX,posY,this.fx,this.fy,this.fz,this.name);

		}
	},

	sparePart: {
		gx: 50,
		gy: 50,
		gz: 10,
		create: function(posX,posY,spareName,texture){
			var spareGeometry = new THREE.PlaneGeometry( this.gx, this.gy, this.gz);
			var spareMaterial = new THREE.MeshPhongMaterial( {
				transparent: true,
				map: texture,
			});
			var sparePart = new THREE.Mesh( spareGeometry, spareMaterial);
			sparePart.position.x = posX;
			sparePart.position.y = posY;
			sparePart.name = spareName;
			sparePartArray.push(sparePart);
			scene.add(sparePart);
		}
	}
};


writeWorld();
function writeWorld(){
	//small
	createObject.smallPlatform.create(400, 400);
	createObject.smallPlatform.create(-1100, -500);
	createObject.smallPlatform.create(-1200, 600);
	createObject.smallPlatform.create(2200, 400);
	createObject.smallPlatform.create(2400, 600);
	createObject.smallPlatform.create(2200, 800);
	createObject.smallPlatform.create(2400, 1000);
	createObject.smallPlatform.create(2200, 1200);
	createObject.smallPlatform.create(2400, 1400); //sparepart 3 on this platform
	createObject.smallPlatform.create(3200, 1600);
	createObject.smallPlatform.create(3000, 1800);
	createObject.smallPlatform.create(1000, 1200);
	createObject.smallPlatform.create(400, 2000);

	//large
	createObject.largePlatform.create(0,0);
	createObject.largePlatform.create(400,0);
	createObject.largePlatform.create(800,0) ;
	createObject.largePlatform.create(800,200);
	createObject.largePlatform.create(0,600);
	createObject.largePlatform.create(-400,600);
	createObject.largePlatform.create(1800,200);
	createObject.largePlatform.create(3000,1400);
	createObject.largePlatform.create(2600,2000);
	createObject.largePlatform.create(2200,2000);
	createObject.largePlatform.create(1800,2000);
	createObject.largePlatform.create(1400,2000);
	createObject.largePlatform.create(1400,1200);
	createObject.largePlatform.create(200,1200);
	createObject.largePlatform.create(-200,1200);

	//spare parts
	createObject.sparePart.create(-1100,-450, "one", sparePartTextures[0]);
	createObject.sparePart.create(-1200, 650, "two", sparePartTextures[0]);
	createObject.sparePart.create(2400, 1450, "three", sparePartTextures[0]);
	createObject.sparePart.create(400, 2050, "four", sparePartTextures[0]);
	//moving platforms
	createObject.movingPlatform.create(-400,0);
}

//background with pipes created

var Pipes = new THREE.PlaneGeometry( 4448, 1062 , 1 );
var pipesMaterial = new THREE.MeshPhongMaterial( {
	map: THREE.ImageUtils.loadTexture("images/pipes.png"),
	transparent: true
});
var pipesBackground = new THREE.Mesh( Pipes, pipesMaterial );
pipesBackground.position.z = 50;
pipesBackground.position.x = 200;
pipesBackground.position.y = -300;
scene.add(pipesBackground);

//background created

var backgroundGeometry = new THREE.PlaneGeometry( 3000, 2000 , 1 );
var backgroundMaterial = new THREE.MeshPhongMaterial( {
	map: THREE.ImageUtils.loadTexture("images/background.jpg"),
});
var background = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
background.position.z = -350;
scene.add(background);


function jump(){
	if (sprite.jumping == false && inAir == false){
		gravity.accel = 1;
		gravity.posY = user.position.y;
		sprite.jumping = true;
	}
}


function fulHack(posX,posY,fx,fy,fz){
	var fixGeometry = new THREE.BoxGeometry(fx,fy,fz);
	var fixMaterial = new THREE.MeshPhongMaterial( {
		visible: false,
		color: "red",

	});
	var fixPlatform = new THREE.Mesh(fixGeometry, fixMaterial);
	fixPlatform.position.x = posX + 125;
	fixPlatform.position.y = posY;
	objectArray.push(fixPlatform);
	scene.add(fixPlatform);
};

function fulHackMoving(posX,posY,fx,fy,fz){
	var fixMovingGeometry = new THREE.BoxGeometry(fx,fy,fz);
	var fixMovingMaterial = new THREE.MeshPhongMaterial( {
		visible: false,
		color: "red",

	});
	fixMovingPlatform = new THREE.Mesh(fixMovingGeometry, fixMovingMaterial);
	fixMovingPlatform.position.x = posX + 125;
	fixMovingPlatform.position.y = posY;
	objectArray.push(fixMovingPlatform);
	scene.add(fixMovingPlatform);
}
