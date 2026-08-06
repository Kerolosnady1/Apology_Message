/* SETUP */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 500;
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a0005, 1);
document.getElementById('preloader').appendChild(renderer.domElement);

/* PARTICLES */
const tl = gsap.timeline({ repeat: -1, yoyo: true });
const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];
for (let i = 0; i < length; i += 0.5) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);
  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;
  vertices.push(vector);
  tl.from(vector, {
      x: 600 / 2, y: -552 / 2, z: 0,
      ease: "power2.inOut",
      duration: "random(2, 5)"
    }, i * 0.002
  );
}
const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
const material = new THREE.PointsMaterial( { color: 0xff0000, blending: THREE.AdditiveBlending, size: 3 } );
const particles = new THREE.Points(geometry, material);
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
scene.add(particles);

/* BACKGROUND HEARTS */
const bgScene = new THREE.Scene();
const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
bgCamera.position.z = 1000;
const bgRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
bgRenderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
bgRenderer.setSize(window.innerWidth, window.innerHeight);

const bgHearts = [];
function createBgHeart() {
    const geometry = new THREE.SphereGeometry(10, 32, 32); // Simplified for performance
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const heart = new THREE.Mesh(geometry, material);
    heart.position.set((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, -1000);
    bgScene.add(heart);
    bgHearts.push({ mesh: heart, speed: Math.random() * 2 + 1 });
}
for (let i = 0; i < 50; i++) createBgHeart();

/* ANIMATION LOOP */
function render() {
  requestAnimationFrame(render);
  geometry.setFromPoints(vertices);
  renderer.render(scene, camera);
  
  bgHearts.forEach(h => {
      h.mesh.position.y += h.speed;
      if (h.mesh.position.y > 1000) h.mesh.position.y = -1000;
  });
  bgRenderer.render(bgScene, bgCamera);
}
requestAnimationFrame(render);

/* PRELOADER FADE OUT */
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 1000);
    }, 4000);
});

/* ENVELOPE INTERACTION */
document.getElementById('envelope').addEventListener('click', function() {
    this.style.display = 'none';
    const letter = document.getElementById('letter');
    letter.classList.remove('hidden');
    setTimeout(() => letter.classList.add('visible'), 10);
});

/* EVENTS */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);
