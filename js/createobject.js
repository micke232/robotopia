
var createObject = {
	smallPlatform: { //g = geometry
		color: "green",
		gx: 200,
		gy: 20,
		gz: 30,
		create: function(posX,posY){
			var smallGeometry = new THREE.BoxGeometry( this.gx, this.gy, this.gz );
			var smallMaterial = new THREE.MeshPhongMaterial( {
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
	//large
	createObject.largePlatform.create(-100,-100);
	createObject.largePlatform.create(-300,-300);
	createObject.largePlatform.create(-500,-500);
	createObject.largePlatform.create(-700,-1200);
}




