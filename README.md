![travis ci build](https://travis-ci.org/pjkarlik/ThreeParticleDrift.svg?branch=master)
![webpack3](https://img.shields.io/badge/webpack-3.0-brightgreen.svg) ![version](https://img.shields.io/badge/version-0.1.2-yellow.svg) 

# ThreeJS Particle Drifting

  /src/Three.js is the import file that combines all required Three.js package files into a window global.

  ```
  import * as THREE from 'three'; // build/three.js from node_module/three
  window.THREE = THREE;
  require('three/examples/js/controls/OrbitControls.js');
  require('three/examples/js/shaders/FresnelShader');
  // ...etc for other items like Render Passes and Shaders
  ```

  Current Mapping --> ```index.js``` --> (render file) ```ParticleDrift\index.js```

## Run the example
  Requires Node v8.5.0 or greater

```bash
$ yarn install
$ yarn dev 
```
 Then open http://localhost:2020
