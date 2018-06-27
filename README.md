![travis ci build](https://travis-ci.org/pjkarlik/ThreeParticleDrift.svg?branch=master)
![webpack3](https://img.shields.io/badge/webpack-3.0-brightgreen.svg) ![version](https://img.shields.io/badge/version-0.1.2-yellow.svg) 

# ThreeJS Particle Drifting
  Various demos and experiments with particles and particle systems. This repository is a working playground using ```THREE```.js to create dynamic visuals.

  Example Links:
  - http://basic-particles.surge.sh/
  - http://bloomdrift.surge.sh/
  - http://bloommirror.surge.sh/
  - http://lorndrift.surge.sh/
 


  /src/Three.js is the import file that combines all required Three.js package files into a window global.

  ```javascript
  import * as THREE from 'three'; // build/three.js from node_module/three
  window.THREE = THREE;
  require('three/examples/js/controls/OrbitControls.js');
  require('three/examples/js/shaders/FresnelShader');
  // ...etc for other items like Render Passes and Shaders
  ```

 ##
*how to load files and view demos.*
##### src/index.js
```javascript
// Import Render class from file //
import Render from './ParticleXXX/index-XXX.js';

window.onload = () => {
  const demo = new Render();
  return demo;
};
```

## Run the example
  Requires Node v8.9.2 or greater

```bash
$ yarn install
$ yarn dev 
```
 Then open http://localhost:2020
