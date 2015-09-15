function createSky(){
	var skyGeo = new THREE.SphereGeometry(2000, 25, 25);
	var texture = THREE.ImageUtils.loadTexture( "images/background.jpg" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1, 1 );
	var material = new THREE.MeshBasicMaterial({
		ambient: "black",
		map: texture,
		depthWrite: false}
																						);
	var sky = new THREE.Mesh(skyGeo, material);
	sky.material.side = THREE.BackSide;
	scene.add(sky);
}
