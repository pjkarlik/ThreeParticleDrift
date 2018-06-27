# Particles

  Basic Particle examples and demos using a basic Particle class that updates itself once the ```update``` function is called. The basic partile take in the basic parameters for position and vector for a three dimensional point.

  - ```Particle\index.js``` Basic Particle Demo and Dat.GUI Interface.
  - ```Particle\index-alt.js``` First Drift Particle Demo Same system but fixed velocity in x vector.
  - ```Particle\index-cmx.js``` Extra Bloom Anit Glow Particle Pattern.

##
*how to load files and view demos.*
##### src/index.js
```javascript
// Import Render class from file //
import Render from './Particle/index-cmx.js';

window.onload = () => {
  const demo = new Render();
  return demo;
};
```
