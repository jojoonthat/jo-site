import { useEffect, useRef } from 'react';

import * as THREE from 'three';
import { Sky } from './threejs-assets/Sky';


function Background() {
  const bgRef = useRef(null);

  useEffect(() => {
    // Make THREE renderer, append renderer dom element to bgRef.current
    const renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    bgRef.current.appendChild(renderer.domElement);

    // Mouse setup
    const mouse = new THREE.Vector2();
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    window.addEventListener('mousemove', onMouseMove, false);

    // Scene and camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.focalLength = 3;
    camera.position.set(30, 30, 80);

    // More scene setup
    const sun = new THREE.Vector3();

    // Skybox
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const parameters = {
      elevation: 2,
      azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);
      sun.setFromSphericalCoords(10000000, phi, theta);
      sky.material.uniforms['sunPosition'].value.copy(sun);
      scene.environment = pmremGenerator.fromScene(sky).texture;
    }

    updateSun();

    // Create cube render target
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      encoding: THREE.sRGBEncoding
    });

    // Create cube camera
    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

    // Create Mesh
    const geometry = new THREE.IcosahedronGeometry(15, 0);
    const material = new THREE.MeshBasicMaterial({
      envMap: cubeRenderTarget.texture,
      combine: THREE.MultiplyOperation,
      reflectivity: 1,
      opacity: 0.8,
      transparent: true,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh)

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize)

    function onMouseMove(event) {
      mouse.x = (event.clientX - windowHalfX) / 20;
      mouse.y = (event.clientY - windowHalfY) / 20;
    }

    function animate() {

      requestAnimationFrame(animate);
      render();

    }

    function render() {
      const time = performance.now() * 0.001;
      // Mesh animation
      mesh.position.y = Math.sin(time) * 20 + 5;
      mesh.rotation.x = time * 0.5;
      mesh.rotation.z = time * 0.51;

      // Camera movement
      camera.position.x += (mouse.x - camera.position.x) * 0.05;
      camera.position.y += (- mouse.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Update render target
      cubeCamera.update(renderer, scene);

      renderer.render(scene, camera);
    }
    animate();
  }, [])

  return (
    <div className="background" ref={bgRef}>
    </div>
  );
}

export default Background;
