import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    
    // Camera with 3D depth perception
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 28);

    // Renderer (Alpha: true allows CSS gradient background to shine through)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // --- 2. LIGHTS SETUP ---
    const ambientLight = new THREE.AmbientLight(0xffe3ec, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffffff, 1.4);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffa0b4, 0.8);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    // --- 3. GEOMETRY SETUP ---
    
    // Heart Geometry
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.3);
    heartShape.bezierCurveTo(0, 0.3, -0.05, 0.1, -0.25, 0.1);
    heartShape.bezierCurveTo(-0.55, 0.1, -0.55, 0.55, -0.55, 0.55);
    heartShape.bezierCurveTo(-0.55, 0.8, -0.35, 1.05, 0, 1.35);
    heartShape.bezierCurveTo(0.35, 1.05, 0.55, 0.8, 0.55, 0.55);
    heartShape.bezierCurveTo(0.55, 0.55, 0.55, 0.1, 0.25, 0.1);
    heartShape.bezierCurveTo(0.05, 0.1, 0, 0.3, 0, 0.3);

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center();
    heartGeometry.scale(1, -1, 1);

    // Star/Diamond Geometry (Shiny Octahedron)
    const starGeometry = new THREE.OctahedronGeometry(0.38, 0);

    // --- 4. SHINY 3D MATERIALS & MESH GENERATION ---
    const colors = [
      0xff4785, // Hot Pink
      0xff6c9d, // Soft Rose
      0xffa0b4, // Pastel Pink
      0xff8ca3, // Salmon Pink
      0xffc2d4  // Very Light Pink
    ];

    const heartMeshes = [];
    
    // Create 3D Pink Hearts (50 counts)
    const heartCount = 50;
    for (let i = 0; i < heartCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 95,
        specular: 0xffffff,
        flatShading: false
      });

      const mesh = new THREE.Mesh(heartGeometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 5
      );

      const scale = Math.random() * 0.9 + 0.6;
      mesh.scale.set(scale, scale, scale);

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.userData = {
        floatSpeed: Math.random() * 0.035 + 0.015,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01
      };

      scene.add(mesh);
      heartMeshes.push(mesh);
    }

    // Create 3D Gold Diamond Stars (22 counts)
    const starCount = 22;
    const starMaterial = new THREE.MeshPhongMaterial({
      color: 0xffd700, // Shiny Gold
      shininess: 120,
      specular: 0xffffff,
      flatShading: true // Faceted look to reflect light beautifully
    });

    for (let i = 0; i < starCount; i++) {
      const mesh = new THREE.Mesh(starGeometry, starMaterial);
      mesh.position.set(
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 5
      );

      const scale = Math.random() * 0.8 + 0.5;
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      mesh.userData = {
        floatSpeed: Math.random() * 0.03 + 0.015,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        rotSpeedZ: (Math.random() - 0.5) * 0.02
      };

      scene.add(mesh);
      heartMeshes.push(mesh); // Put in same animation tracker array
    }

    // --- 5. INTERACTIVE PARALLAX MOUSE/TOUCH POSITION SETUP ---
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    const handlePointerMove = (event) => {
      targetPointerX = (event.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove);

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        targetPointerX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        targetPointerY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    window.addEventListener('touchmove', handleTouchMove);

    // --- 6. ANIMATION RENDER LOOP ---
    let animationFrameId;

    const animate = () => {
      // Float up and rotate meshes (hearts & stars)
      heartMeshes.forEach((mesh) => {
        mesh.position.y += mesh.userData.floatSpeed;
        
        mesh.rotation.x += mesh.userData.rotSpeedX;
        mesh.rotation.y += mesh.userData.rotSpeedY;
        mesh.rotation.z += mesh.userData.rotSpeedZ;

        // Wrap around bottom if floats off top
        if (mesh.position.y > 22) {
          mesh.position.y = -22;
          mesh.position.x = (Math.random() - 0.5) * 32;
        }
      });

      // Smooth camera tilt parallax tracking
      pointerX += (targetPointerX - pointerX) * 0.08;
      pointerY += (targetPointerY - pointerY) * 0.08;

      camera.position.x = pointerX * 3.8;
      camera.position.y = pointerY * 3.8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // --- 7. RESIZE LISTENER ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- 8. CLEANUP DISPOSE ---
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose elements from memory
      heartMeshes.forEach((mesh) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });

      heartGeometry.dispose();
      starGeometry.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="particle-canvas" />;
}

export default ThreeBackground;
