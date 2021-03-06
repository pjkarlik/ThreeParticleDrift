import dat from 'dat.gui';
import THREE from '../Three';
import Particle from '../shared/Particle';

// Render Class Object //
export default class Render {
  constructor() {
    this.frames = 360;
    this.size = 15;
    this.controls = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.render = undefined;
    this.skybox = undefined;
    // Camera Stuff and Viewport //
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.devicePixelRatio = window.devicePixelRatio;
    this.viewAngle = 85;
    this.aspect = this.width / this.height;
    this.near = 0.1;
    this.far = 20000;
    this.background = 0x646464;
    // Particles Stuff //
    this.particles = [];
    this.box = {
      top: 3000,
      left: -3000,
      bottom: -200,
      right: 3000,
    };
    this.settings = {
      gravity: 0.1,
      bounce: 0.75,
    };
    this.camPosition = {
      x: -150.0,
      y: -90.0,
      z: -100.0
    };
    this.trsPosition = {
      x: -150.0,
      y: -90.0,
      z: -100.0
    };
    this.threshold = 0.6;
    this.strength = 2.0;
    this.radius = 0.85;
    this.mirrorValue = 1;
    this.size = 3.5;
    this.isWrireframe = false;
    this.camTimeoutx = true;
    this.camTimeouty = true;
    this.camTimeoutz = true;
    setTimeout(
      () => {
        this.camTimeoutx = false;
        this.camTimeouty = false;
        this.camTimeoutz = false;
      },
      3000 + (600 * Math.random() * 10)
    );
    window.addEventListener('resize', this.resize, true);
    // window.addEventListener('click', () => { console.log(this.camera.position); }, false);
    this.setRender();
    this.setEffects();
    this.createGUI();
    this.renderLoop();
  }

  resize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  };
  
  createGUI = () => {
    this.options = {
      gravity: this.settings.gravity,
      bounce: this.settings.bounce,
      threshold: this.threshold,
      strength: this.strength,
      radius: this.radius,
      mirror: this.mirrorValue,
      gravity: this.settings.gravity,
      size: this.size,
      wireframe: this.isWrireframe,
      light: [255, 255, 255],
    };
    this.gui = new dat.GUI();
    const folderBloom = this.gui.addFolder('Bloom Options');
    folderBloom.add(this.options, 'threshold', 0, 1).step(0.01)
      .onFinishChange((value) => {
        this.bloomPass.threshold = 1.0 - value;
      });
    folderBloom.add(this.options, 'strength', 0, 4).step(0.1)
      .onFinishChange((value) => {
        this.bloomPass.strength = value;
      });
    folderBloom.add(this.options, 'radius', 0, 1).step(0.01)
      .onFinishChange((value) => {
        this.bloomPass.radius = value;
      });
    const folderObject = this.gui.addFolder('Object Options');
    folderObject.add(this.options, 'size', 0, 25).step(0.01)
      .onFinishChange((value) => {
        this.size  = value;
      });
    folderObject.add(this.options, 'gravity', 0, 1).step(0.01)
      .onFinishChange((value) => {
        this.settings.gravity = value;
      });
    folderObject.add(this.options, 'bounce', 0, 1).step(0.01)
      .onFinishChange((value) => {
        this.settings.bounce = value;
      });
    folderObject.add(this.options, 'wireframe')
      .onFinishChange((value) => {
        this.isWrireframe = value;
      });
    const folderEnv = this.gui.addFolder('Environment Options');
    folderEnv.add(this.options, 'mirror', 0, 4).step(1)
      .onFinishChange((value) => {
        this.effect.uniforms.side.value = value;
      });
    folderEnv.addColor(this.options, 'light')
      .onChange((value) => {
        const hue = this.rgbToHex(~~(value[0]), ~~(value[1]), ~~(value[2]));
        this.pointLight.color.setHex(hue);
      });
  }
  
  rgbToHex = (r, g, b) => {
    const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return `0x${hex}`;
  };

  setRender = () => {
    // Set Render and Scene //
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.bufferScene = new THREE.Scene();

    this.scene.fog = new THREE.FogExp2(this.background, 0.00095);
    this.scene.background = new THREE.Color(this.background);

    this.camera = new THREE.PerspectiveCamera(
      this.viewAngle,
      this.aspect,
      this.near,
      this.far
    );

    this.camera.position.set(183, 138, -509);
    this.camera.lookAt(new THREE.Vector3(0, 50, 0));
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.maxDistance = 2500;
    this.controls.minDistance = 0;

    // Set Light //
    this.pointLight = new THREE.PointLight(0xFFFFFF);
    this.pointLight.position.set(250, 250, -900);
    this.scene.add(this.pointLight);

    this.ambient = new THREE.AmbientLight(0x00FF33);
    this.ambient.position.set(0, 650, -150);
    this.scene.add(this.ambient); 
  };

  setEffects = () => {
    let effect;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

    this.effect = new THREE.ShaderPass(THREE.MirrorShader);
    this.effect.uniforms.side.value = this.mirrorValue;
    this.composer.addPass(this.effect);

    this.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.strength, this.radius, 1.0 - this.threshold
    );
    this.composer.addPass(this.bloomPass);

    const copyEffect = new THREE.ShaderPass(THREE.CopyShader);
    copyEffect.renderToScreen = true;
    this.composer.addPass(copyEffect);
  }

  hitRnd = () => {
    const amount = 6 + Math.abs(Math.random() * 19);
    for (let i = 0; i < amount; i++) {
      this.makeParticle(0, 300, 0);
    }
  }

  makeParticle = (mx, my, mz) => {
    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    const sphere = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        specular: 0x999999,
        wireframe: this.isWrireframe
      })
    );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    const point = new Particle({
      size: this.size - Math.random() * 1,
      x: mx,
      y: my,
      z: mz,
      box: this.box,
      settings: this.settings,
      ref: sphere
    });
    const particleColor = Math.sin(this.frames * 0.25 * Math.PI / 180);
    sphere.material.color.setHSL(particleColor,1,0.5);
    sphere.position.set(mx, my, mz);
    this.particles.push(point);
    this.scene.add(sphere);
  };

  checkParticles = () => {
    for (let i = 0; i < this.particles.length; i++) {
      const part = this.particles[i];
      part.update();
      // part.x += 10.5;
      part.ref.position.set(
        part.x, 
        part.y, 
        part.z
      );
      part.ref.scale.x = 1.0 * part.size;
      part.ref.scale.y = 1.0 * part.size;
      part.ref.scale.z = 1.0 * part.size;
      if (part.life > 800 || part.size < 0.0) {
        part.ref.geometry.dispose();
        part.ref.material.dispose();
        this.scene.remove(part.ref);
        part.ref = undefined;
        this.particles.splice(i, 1);
      }
    }
  };

  cameraLoop = () => {
    const damp = 0.008;
    this.camPosition.x = this.camPosition.x - (this.camPosition.x - this.trsPosition.x) * damp;
    this.camPosition.y = this.camPosition.y - (this.camPosition.y - this.trsPosition.y) * damp;
    this.camPosition.z = this.camPosition.z - (this.camPosition.z - this.trsPosition.z) * 0.006;

    this.camera.position.set(
      this.camPosition.x,
      this.camPosition.y,
      this.camPosition.z
    );
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    if(!this.camTimeoutx && Math.random() * 260 > 200) {
      const tempRand = 50 + Math.random() * 200;
      this.trsPosition.x = Math.random() * 255 > 200 ?
        Math.random() * 250 > 100 ? -(tempRand) : tempRand : 0;
      this.camTimeoutx = true;
      setTimeout(
        () => { this.camTimeoutx = false; },
        6000 + (1000 * Math.random() * 20)
      );
    }
    // if(!this.camTimeouty && Math.random() * 260 > 200) {
    //   const tempRand = 100 + Math.random() * 500;
    //   this.trsPosition.y = Math.random() * 255 > 200 ?
    //     Math.random() * 250 > 100 ? tempRand : -(tempRand * 3) : 0;
    //   this.camTimeouty = true;
    //   setTimeout(
    //     () => { this.camTimeouty = false; },
    //     6000 + (1000 * Math.random() * 20)
    //   );
    // }
    if(!this.camTimeoutz && Math.random() * 255 > 200) {
      const tempRand = 50 + Math.random() * 200;
      this.trsPosition.z = Math.random() * 255 > 200 ?
        Math.random() * 250 > 100 ? -(tempRand) : tempRand : 0;
      this.camTimeoutz = true;
      setTimeout(
        () => { this.camTimeoutz = false; },
        6000 + (1000 * Math.random() * 20)
      );
    }
  };

  renderScene = () => {
    this.composer.render();
    // this.renderer.render(this.scene, this.camera);
    // this.effect.render(this.scene, this.camera);
  };

  renderLoop = () => {
    this.checkParticles();
    if(Math.random() * 200 > 100 && this.particles.length < 2000) {
      this.hitRnd();
    }
    this.cameraLoop();
    this.renderScene();
    this.frames++;
    window.requestAnimationFrame(this.renderLoop);
  };
}
