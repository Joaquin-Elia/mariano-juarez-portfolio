import * as THREE from "three";
import galleryImgs from "../data/galleryData";

let animationFrameId: number | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let meshes: THREE.Mesh[] = [];

const config = {
  minHeight: 1,
  maxHeight: 1.5,
  aspectRatio: 1.5,
  gap: 0.05,
  smoothness: 0.05,
  distortionStrength: 2.5,
  distortionSmoothness: 0.1,
  momentumFriction: 0.95,
  mementumThreshold: 0.001,
  weelSpeed: 0.01,
  weelMax: 150,
  dragSpeed: 0.01,
  dragMomentum: 0.01,
  touchSpeed: 0.01,
  touchMomentum: 0.1,
};

const wrap = (value: number, range: number) =>
  ((value % range) + range) % range;

const eventListeners: Array<{
  target: EventTarget;
  type: string;
  handler: any;
  options?: any;
}> = [];

function addManagedListener(
  target: EventTarget,
  type: string,
  handler: any,
  options?: any,
) {
  target.addEventListener(type, handler, options);
  eventListeners.push({ target, type, handler, options });
}

function removeAllListeners() {
  eventListeners.forEach(({ target, type, handler, options }) => {
    target.removeEventListener(type, handler, options);
  });
  eventListeners.length = 0;
}

export const initGallery = () => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  if (!canvas) return;

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f4f4);

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.z = 5;

  const totalImages = galleryImgs.length;
  const galleryHeights = Array.from(
    { length: totalImages },
    () =>
      config.minHeight + Math.random() * (config.maxHeight - config.minHeight),
  );

  const galleryOffsets: number[] = [];
  let stackPosition = 0;

  for (let i = 0; i < totalImages; i++) {
    if (i === 0) {
      galleryOffsets.push(0);
      stackPosition = galleryHeights[0] / 2;
    } else {
      stackPosition += config.gap + galleryHeights[i] / 2;
      galleryOffsets.push(stackPosition);
      stackPosition += galleryHeights[i] / 2;
    }
  }

  const loopLength = stackPosition + config.gap + galleryHeights[0] / 2;
  const halfLoop = loopLength / 2;

  meshes = [];
  const textureLoader = new THREE.TextureLoader();

  for (let i = 0; i < totalImages; i++) {
    const height = galleryHeights[i];
    const width = height * config.aspectRatio;

    const geometry = new THREE.PlaneGeometry(width, height, 32, 16);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: 0x999999,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.userData = {
      originalVertices: [...geometry.attributes.position.array],
      offset: galleryOffsets[i],
      index: i,
    };

    textureLoader.load(galleryImgs[i].img, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.color.set(0xffffff);
      material.needsUpdate = true;

      const imageAspect = texture.image.width / texture.image.height;
      const planeAspect = width / height;
      const ratio = imageAspect / planeAspect;

      if (ratio > 1) mesh.scale.y = 1 / ratio;
      else mesh.scale.x = ratio;
    });

    scene.add(mesh);
    meshes.push(mesh);
  }

  const applyDistortion = (
    mesh: THREE.Mesh,
    positionY: number,
    strength: number,
  ) => {
    const positions = mesh.geometry.attributes.position;
    const original = mesh.userData.originalVertices;

    for (let i = 0; i < positions.count; i++) {
      const x = original[i * 3];
      const y = original[i * 3 + 1];

      const distance = Math.sqrt(x * x + (positionY + y) ** 2);
      const falloff = Math.max(0, 1 - distance / 2);
      const bend = Math.pow(Math.sin((falloff * Math.PI) / 2), 1.5);
      positions.setZ(i, bend * strength);
    }

    positions.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  };

  let scrollPosition = 0;
  let scrollTarget = 0;
  let scrollMomentum = 0;
  let isScrolling = false;
  let lastFrameTime = 0;

  let distortionAmount = 0;
  let distortionTarget = 0;
  let velocityPeak = 0;
  let scrollDirection = 0;
  let directionTarget = 0;
  let velocityHistory = [0, 0, 0, 0, 0];

  let isDragging = false;
  let dragStartY = 0;
  let dragDelta = 0;
  let touchStartY = 0;
  let touchLastY = 0;
  let activeGalleryImg = -1;

  const addDistortionBurst = (amount: number) => {
    distortionTarget = Math.min(1, distortionTarget + amount);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const clampedDelta =
      Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), config.weelMax);
    addDistortionBurst(Math.abs(clampedDelta) * 0.001);
    scrollTarget += clampedDelta * config.weelSpeed;
    isScrolling = true;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    clearTimeout((handleWheel as any).scrollTimeout);
    (handleWheel as any).scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 150);
  };

  addManagedListener(window, "wheel", handleWheel, { passive: false });

  addManagedListener(
    window,
    "touchstart",
    (e: TouchEvent) => {
      touchStartY = touchLastY = e.touches[0].clientY;
      isScrolling = false;
      scrollMomentum = 0;
    },
    { passive: true },
  );

  addManagedListener(
    window,
    "touchmove",
    (e: TouchEvent) => {
      e.preventDefault();
      const deltaY = e.touches[0].clientY - touchLastY;
      touchLastY = e.touches[0].clientY;
      addDistortionBurst(Math.abs(deltaY) * 0.002);
      scrollTarget -= deltaY * config.touchSpeed;
      isScrolling = true;
    },
    { passive: false },
  );

  addManagedListener(window, "touchend", () => {
    const swipeVelocity = (touchLastY - touchStartY) * 0.005;
    if (Math.abs(swipeVelocity) > 0.5) {
      scrollMomentum = -swipeVelocity * config.touchMomentum;
      addDistortionBurst(Math.abs(swipeVelocity) * 0.45);
      isScrolling = true;
      setTimeout(() => (isScrolling = false), 800);
    }
  });

  canvas.style.cursor = "grab";

  addManagedListener(window, "mousedown", (e: MouseEvent) => {
    isDragging = true;
    dragStartY = e.clientY;
    dragDelta = 0;
    scrollMomentum = 0;
    canvas.style.cursor = "grabbing";
  });

  addManagedListener(window, "mousemove", (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY;
    dragStartY = e.clientY;
    dragDelta = deltaY;
    addDistortionBurst(Math.abs(deltaY) * 0.02);
    scrollTarget -= deltaY * config.dragSpeed;
    isScrolling = true;
  });

  addManagedListener(window, "mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    canvas.style.cursor = "grab";
    if (Math.abs(dragDelta) > 2) {
      scrollMomentum = -dragDelta * config.dragMomentum;
      addDistortionBurst(Math.abs(dragDelta) * 0.005);
      isScrolling = true;
      setTimeout(() => (isScrolling = false), 800);
    }
  });

  addManagedListener(window, "resize", () => {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });

  const animate = (time: number) => {
    animationFrameId = requestAnimationFrame(animate);

    const deltaTime = lastFrameTime ? (time - lastFrameTime) / 1000 : 0.016;
    lastFrameTime = time;

    const previousScroll = scrollPosition;

    if (isScrolling) {
      scrollTarget += scrollMomentum;
      scrollMomentum *= config.momentumFriction;
      if (Math.abs(scrollMomentum) < config.mementumThreshold) {
        scrollMomentum = 0;
      }
    }

    scrollPosition += (scrollTarget - scrollPosition) * config.smoothness;

    const frameDelta = scrollPosition - previousScroll;

    if (Math.abs(frameDelta) > 0.00001) {
      directionTarget = frameDelta > 0 ? 1 : -1;
    }

    scrollDirection += (directionTarget - scrollDirection) * 0.08;
    const velocity = Math.abs(frameDelta) / deltaTime;

    velocityHistory.push(velocity);
    velocityHistory.shift();
    const averageVelocity =
      velocityHistory.reduce((a, b) => a + b) / velocityHistory.length;

    if (averageVelocity > velocityPeak) velocityPeak = averageVelocity;

    const isDecelerating =
      averageVelocity / (velocityPeak + 0.001) < 0.7 && velocity > 0.5;
    velocityPeak *= 0.99;

    if (velocity > 0.05)
      distortionTarget = Math.max(distortionTarget, Math.min(1, velocity * 0.1));

    if (isDecelerating || averageVelocity < 0.2)
      distortionTarget *= isDecelerating ? 0.95 : 0.855;

    distortionAmount +=
      (distortionTarget - distortionAmount) * config.distortionSmoothness;

    const signedDistortion = distortionAmount * scrollDirection;

    let clossestDistance = Infinity;
    let clossestIndex = 0;

    meshes.forEach((mesh) => {
      const { offset } = mesh.userData;
      let y = -(offset - wrap(scrollPosition, loopLength));
      y = wrap(y + halfLoop, loopLength) - halfLoop;

      mesh.position.y = y;

      if (Math.abs(y) < clossestDistance) {
        clossestDistance = Math.abs(y);
        clossestIndex = mesh.userData.index;
      }

      if (Math.abs(y) < halfLoop + config.maxHeight) {
        applyDistortion(mesh, y, config.distortionStrength * signedDistortion);
      }
    });

    if (clossestIndex !== activeGalleryImg) {
      activeGalleryImg = clossestIndex;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };

  animationFrameId = requestAnimationFrame(animate);
};

export const cleanupGallery = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  removeAllListeners();

  if (scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material.map) {
          object.material.map.dispose();
        }
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    scene = null;
  }

  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer = null;
  }

  camera = null;
  meshes = [];
};

// Handle Astro View Transitions
document.addEventListener("astro:page-load", initGallery);
document.addEventListener("astro:before-swap", cleanupGallery);

