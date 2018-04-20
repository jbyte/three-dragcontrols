# three-dragcontrols

Drag controls for https://github.com/mrdoob/three.js with support for ES6 import

Inspired by https://github.com/yomotsu/camera-controls to create the ES6 module

# Installation

`npm install drag-controls`

# Usage

```javascript
import * as THREE from 'three'
import DragControls from 'drag-controls'

DragControls.install({THREE: THREE})

var objects = []
// init threejs scene
const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1000)
const renderer = new THREE.WebGLRenderer()
// set renderer size and append domElement to the desired conponent
// add some meshes to the scene and the 'objects' array

const dragControls = new DragControls(objects, camera, domElement)

// you may also want to add an mouse move event listener to render when moving objects
renderer.domElement.addEventListener("mousemove", function() {
    renderer.render(scene, camera)
});
```
