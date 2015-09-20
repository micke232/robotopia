 var dirLight = new THREE.DirectionalLight("white", 1);
 dirLight.position.set(100, 100, 210);
 scene.add(dirLight);



var dir2Light = new THREE.PointLight("white", 0.5);
 dir2Light.position.set(0, -400, -500);
 scene.add(dir2Light);


var dir3Light = new THREE.PointLight("white", 0.5);
 dir3Light.position.set(-1200, -400, -500);
 scene.add(dir3Light);
