var mPlatform;
var createObject = {
	smallPlatform: { //g = geometry
		gx: 200,
		gy: 20,
		gz: 30,
		create: function(posX,posY){
			var smallGeometry = new THREE.BoxGeometry( this.gx, this.gy, this.gz );
			var smallMaterial = new THREE.MeshPhongMaterial( {
				map: THREE.ImageUtils.loadTexture("images/platform.jpg"),

			});
			var smallPlatform = new THREE.Mesh( smallGeometry, smallMaterial );
			smallPlatform.position.x = posX;
			smallPlatform.position.y = posY;
			objectArray.push(smallPlatform);
			scene.add(smallPlatform);
		}
	},

	largePlatform: { //g = geometry
		gx: 400,
		gy: 20,
		gz: 50,
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
		}
	},

	movingPlatform: {
		gx: 200,
		gy: 20,
		gz: 30,
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
			mPlatform.name = "moving";
			objectArray.push(mPlatform);
			scene.add(mPlatform);
		}
	},

	sparePart: {
		gx: 50,
		gy: 50,
		gz: 10,
		create: function(posX,posY,spareName){
			var spareGeometry = new THREE.PlaneGeometry( this.gx, this.gy, this.gz);
			var spareMaterial = new THREE.MeshPhongMaterial( {
				transparent: true,
				map: THREE.ImageUtils.loadTexture("images/sparepart.png"),
			});
			var sparePart = new THREE.Mesh( spareGeometry, spareMaterial);
			sparePart.position.x = posX;
			sparePart.position.y = posY;
			sparePart.name = spareName;
			objectArray.push(sparePart);
			scene.add(sparePart);
		}
	}
};


writeWorld();
function writeWorld(){
	//small
	createObject.smallPlatform.create(400, 400);
	createObject.smallPlatform.create(200, 600);
	createObject.smallPlatform.create(-1100, -500);

	//large
	createObject.largePlatform.create(0,0);
	createObject.largePlatform.create(400,0);
	createObject.largePlatform.create(800,0);
	createObject.largePlatform.create(800,200);
	createObject.largePlatform.create(-300,600);
	createObject.largePlatform.create(-700,600);
	createObject.largePlatform.create(-1100,600);
	createObject.largePlatform.create(-1900,600);
	//spare parts
	createObject.sparePart.create(800,250, "ett");
  //
	createObject.movingPlatform.create(-400,0);
}

//background
var backgroundGeometry = new THREE.PlaneGeometry( 8887, 4032 , 1 );
var backgroundMaterial = new THREE.MeshPhongMaterial( {
	map: THREE.ImageUtils.loadTexture("images/skydome.jpg"),
});
var background = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
background.position.z = -2000;

scene.add(background);



