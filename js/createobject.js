
var createObject = {
	smallPlatform: { //g = geometry
		gx: 200,
		gy: 20,
		gz: 30,
		create: function(posX,posY){
			var smallGeometry = new THREE.BoxGeometry( this.gx, this.gy, this.gz );
			var smallMaterial = new THREE.MeshPhongMaterial( {
				map: THREE.ImageUtils.loadTexture("images/platform.jpg"),
				color: this.color,
			});
			var smallPlatform = new THREE.Mesh( smallGeometry, smallMaterial );
			smallPlatform.position.x = posX;
			smallPlatform.position.y = posY;
			objectArray.push(smallPlatform);
			scene.add(smallPlatform);
		}

	},

	largePlatform: { //g = geometry
		color: "green",
		gx: 400,
		gy: 20,
		gz: 50,
		create: function(posX,posY){
			var largeGeometry = new THREE.BoxGeometry( this.gx, this.gy, this.gz );
			var largeMaterial = new THREE.MeshPhongMaterial( {
				map: THREE.TextureUtils.loadTexture("images/platform.jpg"),
				color: this.color,
			});
			var largePlatform = new THREE.Mesh( largeGeometry, largeMaterial );
			largePlatform.position.x = posX;
			largePlatform.position.y = posY;
			objectArray.push(largePlatform);
			scene.add(largePlatform);
		}
	}
};


writeWorld();
function writeWorld(){
	//small
	createObject.smallPlatform.create(0,0);
	createObject.smallPlatform.create(-300,50);
	createObject.smallPlatform.create(-600,100);
	createObject.smallPlatform.create(-900,150);
	createObject.smallPlatform.create(-1200,200);
	createObject.smallPlatform.create(-1500,250);
	createObject.smallPlatform.create(-1800,300);
	createObject.smallPlatform.create(-2100,250);
	createObject.smallPlatform.create(-2400,200);
	//large


}




