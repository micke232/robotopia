

var particleMaterial = new THREE.MeshLambertMaterial({
	emissive: "#00ff0a",
	color: "green",
	doubleSided: true,
	transparent: true,
	map: THREE.ImageUtils.loadTexture("images/spriteparticle.png")

});

var posX,
		posY,
		posZ,
		cloneParticle;

var particleGeometry = new THREE.CircleGeometry(5,25);
var particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);

var particleCount = 500;


for (var i = 0; i < particleCount; i++){
	posX = randomGenerator() * 10;
	posY = randomGenerator() * 2;
	posZ = randomGenerator();
	cloneParticle = particleMesh.clone();
	cloneParticle.position.set(posX, posY, posZ);

	rain.push(cloneParticle);
	scene.add(cloneParticle);
};

function randomGenerator(){
	return Math.floor((Math.random() * 4000) - 2000);
};
