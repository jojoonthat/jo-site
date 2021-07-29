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

    // Ambient Light
    const light = new THREE.AmbientLight(0x404040, 9); // soft white light
    scene.add(light);

    // More scene setup
    const sun = new THREE.Vector3();

    // Skybox
    const sky = new Sky();
    sky.scale.setScalar(1000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 6;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.75;

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
    const icoGeometrySmall = new THREE.IcosahedronGeometry(1, 0);
    const icoGeometryMedium = new THREE.IcosahedronGeometry(2, 0);
    const icoGeometryLarge = new THREE.IcosahedronGeometry(4, 0);
    const mirrorMaterial = new THREE.MeshPhongMaterial({
      envMap: cubeRenderTarget.texture,
      combine: THREE.MultiplyOperation,
      reflectivity: 1,
      opacity: 0.7,
      transparent: true,
      side: THREE.DoubleSide,
      color: 0xfbb3ff
    });
    const textMirrorMaterial = new THREE.MeshLambertMaterial({
      envMap: cubeRenderTarget.texture,
      combine: THREE.MultiplyOperation,
      reflectivity: 1,
      roughness: 0,
      metalness: 1,
      opacity: 0.67,
      transparent: true,
      side: THREE.DoubleSide,
      color: 0xC6C5C5
    });

    const mesh1 = new THREE.Mesh(icoGeometryLarge, mirrorMaterial);
    mesh1.position.x = 30;
    mesh1.position.y = -5;
    mesh1.position.z = -5;
    scene.add(mesh1)

    const mesh2 = new THREE.Mesh(icoGeometryLarge, mirrorMaterial);
    mesh2.position.x = -30;
    mesh2.position.y = 5;
    mesh2.position.z = -10;
    scene.add(mesh2);

    const mesh3 = new THREE.Mesh(icoGeometryLarge, mirrorMaterial);
    mesh3.position.x = 5;
    mesh3.position.y = 10;
    mesh3.position.z = -6;
    scene.add(mesh3);

    const mesh4 = new THREE.Mesh(icoGeometrySmall, mirrorMaterial);
    mesh4.position.x = -22.8;
    mesh4.position.y = 0.5;
    mesh4.position.z = 6;
    scene.add(mesh4);

    const mesh5 = new THREE.Mesh(icoGeometryLarge, mirrorMaterial);
    mesh5.position.x = -12;
    mesh5.position.y = -10;
    mesh5.position.z = -7;
    scene.add(mesh5);

    const mesh6 = new THREE.Mesh(icoGeometrySmall, mirrorMaterial);
    mesh6.position.x = 20.8;
    mesh6.position.y = -8;
    mesh6.position.z = 9;
    scene.add(mesh6);

    const mesh7 = new THREE.Mesh(icoGeometrySmall, mirrorMaterial);
    mesh7.position.x = 40.8;
    mesh7.position.y = 9;
    mesh7.position.z = 5;
    scene.add(mesh7);

    const mesh8 = new THREE.Mesh(icoGeometryMedium, mirrorMaterial);
    mesh8.position.x = -42.8;
    mesh8.position.y = 9;
    mesh8.position.z = 5;
    scene.add(mesh8);

    const mesh9 = new THREE.Mesh(icoGeometrySmall, mirrorMaterial);
    mesh9.position.x = -45.8;
    mesh9.position.y = -10;
    mesh9.position.z = 7;
    scene.add(mesh9);

    const mesh10 = new THREE.Mesh(icoGeometryMedium, mirrorMaterial);
    mesh10.position.x = 45.8;
    mesh10.position.y = -8;
    mesh10.position.z = 7;
    scene.add(mesh10);

    const fontLoader = new THREE.FontLoader();

    fontLoader.load('monoton.json', font => {
      const textGeometry = new THREE.TextGeometry('JOANNE'.split('').join(' '), {
        font: font,
        size: 16,
        height: 3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
      });

      const textMesh = new THREE.Mesh(textGeometry, textMirrorMaterial);
      textGeometry.computeBoundingBox();
      const centerX = - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
      const centerY = - 0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
      textMesh.position.x = centerX;
      textMesh.position.y = centerY;
      scene.add(textMesh)
    })

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
      mesh1.rotation.x = time * 0.4;
      mesh1.rotation.z = time * 0.1;

      mesh2.rotation.x = -time * 0.2;
      mesh2.rotation.y = time * 0.4;

      mesh3.rotation.x = time * 0.2;
      mesh3.rotation.z = -time * 0.4;

      mesh4.rotation.x = -time * 0.42;
      mesh4.rotation.z = -time * 0.32;

      mesh5.rotation.y = -time * 0.19;
      mesh5.rotation.z = time * 0.32;

      mesh6.rotation.x = -time * 0.4;
      mesh6.rotation.z = time * 0.62;

      mesh7.rotation.y = -time * 0.6;
      mesh7.rotation.z = time * 0.49;

      mesh8.rotation.y = -time * 0.6;
      mesh8.rotation.z = -time * 0.49;

      mesh9.rotation.y = time * 0.45;
      mesh9.rotation.z = -time * 0.4;

      mesh10.rotation.x = time * 0.2;
      mesh10.rotation.z = time * 0.01;

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
