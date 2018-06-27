# Particle Drift

  Taking the basic particle, and now adding a fixed value for the x vector we create what seems like never ending tunnels and landscapes drifting by. What is really happening is a fixed camera is rotating around a focus point while particles are being sprayed into/out of view.

  - ```ParticleDrift\index.js``` Basic Drift Particle Demo with alternating shapes.
  - ```ParticleDrift\index-alt.js``` Bloom Drift Particle Demo with dynamic camera movements.
  - ```ParticleDrift\index-fzz.js``` Single Particle Drift with a distorting fragment shader compositing the render.
  - ```ParticleDrift\index-sgl.js``` Ghostly mutation of the drift with heavy bloom on black and white render. Custom fragment shader using live distortion.

##
*how to load files and view demos.*
##### src/index.js
```javascript
// Import Render class from file //
import Render from './ParticleDrift/index-sgl.js';

window.onload = () => {
  const demo = new Render();
  return demo;
};
```
