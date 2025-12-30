// Three.js 3D Background Setup
let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize Three.js Scene
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    const container = document.getElementById('threejs-background');
    container.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create particles
    createParticles();
    
    // Add floating cubes
    createFloatingCubes();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle mouse movement
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Start animation
    animate();
}

// Create particle system
function createParticles() {
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x667eea); // Blue
    const color2 = new THREE.Color(0x764ba2); // Purple
    const color3 = new THREE.Color(0x00dbde); // Cyan
    
    for (let i = 0; i < particleCount; i++) {
        // Random positions
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        // Random colors
        const rand = Math.random();
        let color;
        if (rand < 0.33) {
            color = color1;
        } else if (rand < 0.66) {
            color = color2;
        } else {
            color = color3;
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// Create floating 3D cubes
function createFloatingCubes() {
    const cubeCount = 10;
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    for (let i = 0; i < cubeCount; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        
        // Random position
        cube.position.x = (Math.random() - 0.5) * 50;
        cube.position.y = (Math.random() - 0.5) * 50;
        cube.position.z = (Math.random() - 0.5) * 50;
        
        // Random rotation
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        // Store animation properties
        cube.userData = {
            speed: 0.5 + Math.random() * 1,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatHeight: 2 + Math.random() * 3,
            originalY: cube.position.y
        };
        
        scene.add(cube);
    }
}

// Animate particles and cubes
function animateParticles() {
    const positions = particleSystem.geometry.attributes.position.array;
    const time = Date.now() * 0.0001;
    
    for (let i = 0; i < positions.length; i += 3) {
        // Gentle floating motion
        positions[i] += Math.sin(time + i) * 0.01;
        positions[i + 1] += Math.cos(time + i) * 0.01;
        
        // Keep particles in bounds
        if (Math.abs(positions[i]) > 50) positions[i] *= -0.99;
        if (Math.abs(positions[i + 1]) > 50) positions[i + 1] *= -0.99;
        if (Math.abs(positions[i + 2]) > 50) positions[i + 2] *= -0.99;
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Rotate particle system
    particleSystem.rotation.x += 0.0003;
    particleSystem.rotation.y += 0.0005;
    
    // Animate cubes
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry.type === 'BoxGeometry') {
            const data = child.userData;
            
            // Rotate cube
            child.rotation.x += data.rotationSpeed.x;
            child.rotation.y += data.rotationSpeed.y;
            child.rotation.z += data.rotationSpeed.z;
            
            // Float up and down
            child.position.y = data.originalY + Math.sin(Date.now() * 0.001 * data.floatSpeed) * data.floatHeight;
            
            // Gentle horizontal movement
            child.position.x += Math.sin(Date.now() * 0.001 * data.speed) * 0.01;
            child.position.z += Math.cos(Date.now() * 0.001 * data.speed) * 0.01;
        }
    });
}

// Handle window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.0005;
    mouseY = (event.clientY - windowHalfY) * 0.0005;
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update camera position based on mouse
    camera.position.x += (mouseX * 20 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 20 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Animate particles and cubes
    animateParticles();
    
    // Render scene
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initThreeJS);

// Export for other scripts
window.threeJS = {
    scene,
    camera,
    renderer,
    animateParticles
};
