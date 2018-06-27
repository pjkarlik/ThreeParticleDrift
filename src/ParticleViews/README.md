# Particle Views

  Taking the basic particle, and now adding a fixed value for the x vector we create what seems like never ending tunnels and landscapes drifting by. What is really happening is a fixed camera is rotating around a focus point while particles are being sprayed into/out of view.

  - ```ParticleViews\index.js``` Slow motion drifing with a bunch of options via Dat.GUI.
 
##
*how to load files and view demos.*
##### src/index.js
```javascript
// Import Render class from file //
import Render from './ParticleViews/index.js';

window.onload = () => {
  const demo = new Render();
  return demo;
};
```
