var gravity = 2;
var sprite = {
	height: 50
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 200, 10, 50 );
var material = new THREE.MeshBasicMaterial( {
	color: 0x00ff00
} );

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 200;
camera.position.y = 100;

var userGeometry = new THREE.BoxGeometry( 50, 100, 1 );
var userMaterial = new THREE.MeshBasicMaterial( {
	color: "red"
} );
var user = new THREE.Mesh( userGeometry, userMaterial );
user.position.y = 200;
scene.add(user);




function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}



function animate(){
	requestAnimationFrame( animate );


	if (user.position.y <= (cube.position.y + sprite.height)){
	}
	else user.position.y -= gravity;
  render();

}
animate();
