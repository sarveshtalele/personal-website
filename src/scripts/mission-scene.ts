/**
 * "Mission Log" homepage scene. A ship flies along a curved path past one
 * planet per chapter while the visitor scrolls; stars, nebula glow and the
 * odd shooting star fill the space between. Everything is built from
 * primitives and canvas-drawn textures, so there are no model or image files.
 *
 * Light mode is a warm dawn sky; dark mode is deep space. Colours are read from
 * the theme tokens so the scene always matches the rest of the site.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NormalBlending,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  BoxGeometry,
  type Blending,
} from 'three';

type Theme = { dark: boolean; star: Color; gold: Color; accent: Color; primary: Color };

const SPACING = 70;
const PLANET_TONES = [
  ['#c98b55', '#8a5a33'],
  ['#d9b77e', '#a67c3d'],
  ['#7d8fa6', '#46627a'],
  ['#b56b4f', '#6b3a2a'],
  ['#9aa77c', '#5c6b45'],
  ['#c7a98a', '#7f6a57'],
  ['#8f6fa6', '#4e3a66'],
  ['#d38a6a', '#8c4a35'],
];

function readTheme(): Theme {
  const css = getComputedStyle(document.documentElement);
  const get = (v: string, f: string) => new Color(css.getPropertyValue(v).trim() || f);
  const dark = document.documentElement.classList.contains('dark');
  return {
    dark,
    star: dark ? new Color('#f2e8d8') : new Color('#6b4226'),
    gold: get('--gold-1', '#c9a45c'),
    accent: get('--accent', '#a67c3d'),
    primary: get('--primary', '#6b4226'),
  };
}

/** Soft round glow, drawn once on a canvas and reused by sprites. */
function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.45)'));
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Banded "gas giant" surface: a few soft stripes with noise, in two tones. */
function planetTexture(a: string, b: string, seed: number) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, a);
  grad.addColorStop(1, b);
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 256);
  let r = seed * 9301 + 49297;
  const rand = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 26; i++) {
    const y = rand() * 256;
    const h = 2 + rand() * 18;
    g.fillStyle = `rgba(${rand() > 0.5 ? '255,240,220' : '40,25,15'},${0.05 + rand() * 0.12})`;
    g.beginPath();
    for (let x = 0; x <= 512; x += 16) g.lineTo(x, y + Math.sin(x / 40 + i) * 3);
    g.lineTo(512, y + h);
    for (let x = 512; x >= 0; x -= 16) g.lineTo(x, y + h + Math.sin(x / 50 + i) * 3);
    g.closePath();
    g.fill();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function buildShip(theme: Theme) {
  const ship = new Group();
  const hull = new MeshStandardMaterial({ color: '#efe6d6', metalness: 0.55, roughness: 0.35 });
  const trim = new MeshStandardMaterial({
    color: theme.gold,
    metalness: 0.8,
    roughness: 0.25,
    emissive: theme.gold,
    emissiveIntensity: 0.15,
  });
  const body = new Mesh(new CylinderGeometry(0.32, 0.5, 2.6, 18), hull);
  body.rotation.x = Math.PI / 2;
  const nose = new Mesh(new ConeGeometry(0.32, 1.1, 18), hull);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = -1.85;
  const cockpit = new Mesh(
    new SphereGeometry(0.24, 16, 12),
    new MeshStandardMaterial({ color: '#2b3a4a', metalness: 0.9, roughness: 0.1 }),
  );
  cockpit.position.set(0, 0.22, -0.9);
  cockpit.scale.set(1, 0.7, 1.6);
  const wingGeo = new BoxGeometry(2.4, 0.06, 0.9);
  const wings = new Mesh(wingGeo, trim);
  wings.position.set(0, -0.05, 0.4);
  const fin = new Mesh(new BoxGeometry(0.06, 0.7, 0.7), trim);
  fin.position.set(0, 0.45, 0.85);
  const engine = new Mesh(new CylinderGeometry(0.36, 0.3, 0.4, 18), trim);
  engine.rotation.x = Math.PI / 2;
  engine.position.z = 1.45;
  const flame = new Sprite(
    new SpriteMaterial({
      map: glowTexture('rgba(255,200,120,1)'),
      color: theme.gold,
      blending: AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  flame.scale.set(1.8, 1.8, 1);
  flame.position.z = 1.9;
  ship.add(body, nose, cockpit, wings, fin, engine, flame);
  ship.userData.flame = flame;
  ship.userData.trim = trim;
  return ship;
}

export function startMissionScene(canvas: HTMLCanvasElement, chapterCount: number) {
  const mobile = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null; // No WebGL: the CSS sky behind the canvas stays as the fallback.
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(mobile ? 70 : 58, 1, 0.1, 900);
  let theme = readTheme();

  // ---- lights ----
  const ambient = new AmbientLight('#ffffff', 0.55);
  const sun = new DirectionalLight('#ffe9c8', 1.6);
  sun.position.set(-40, 30, 20);
  const shipLight = new PointLight(theme.gold, 6, 25, 2);
  scene.add(ambient, sun, shipLight);

  // ---- stars: three layers along a long tunnel ----
  const LEN = chapterCount * SPACING + 160;
  const starTex = glowTexture('rgba(255,255,255,1)');
  const starLayers: Points[] = [];
  const layerDefs = mobile
    ? [
        [700, 0.5],
        [350, 0.9],
        [120, 1.5],
      ]
    : [
        [2200, 0.45],
        [1000, 0.85],
        [300, 1.5],
      ];
  for (const [count, size] of layerDefs) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 25 + Math.random() * 170;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.6;
      pos[i * 3 + 2] = 60 - Math.random() * (LEN + 120);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    // Round, soft stars (plain points render as squares).
    const mat = new PointsMaterial({
      size: size * 1.6,
      map: starTex,
      alphaTest: 0.02,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
    });
    const pts = new Points(geo, mat);
    starLayers.push(pts);
    scene.add(pts);
  }

  // ---- nebula glows ----
  const nebulae: Sprite[] = [];
  const nebTex = glowTexture();
  for (let i = 0; i < (mobile ? 5 : 9); i++) {
    const s = new Sprite(new SpriteMaterial({ map: nebTex, transparent: true, depthWrite: false }));
    const sc = 90 + Math.random() * 120;
    s.scale.set(sc, sc * 0.7, 1);
    s.position.set((Math.random() - 0.5) * 220, (Math.random() - 0.5) * 90, -Math.random() * LEN);
    nebulae.push(s);
    scene.add(s);
  }

  // ---- planets: one per chapter ----
  const planets: Group[] = [];
  const waypoints: Vector3[] = [new Vector3(0, 2, 30)];
  for (let i = 0; i < chapterCount; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const z = -i * SPACING - 30;
    const radius = 6 + ((i * 7) % 5) * 1.6;
    const [a, b] = PLANET_TONES[i % PLANET_TONES.length];
    const g = new Group();
    const sphere = new Mesh(
      new SphereGeometry(radius, mobile ? 32 : 56, mobile ? 20 : 36),
      new MeshStandardMaterial({ map: planetTexture(a, b, i + 1), roughness: 0.92, metalness: 0.05 }),
    );
    sphere.rotation.z = 0.35 * side;
    g.add(sphere);
    if (i % 3 === 1) {
      const ring = new Mesh(
        new RingGeometry(radius * 1.35, radius * 2.1, 64),
        new MeshBasicMaterial({ color: b, side: DoubleSide, transparent: true, opacity: 0.45 }),
      );
      ring.rotation.x = Math.PI / 2.4;
      ring.rotation.y = 0.3 * side;
      g.add(ring);
    }
    const halo = new Sprite(
      new SpriteMaterial({
        map: glowTexture(),
        color: a,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        opacity: 0.35,
      }),
    );
    halo.scale.set(radius * 4.2, radius * 4.2, 1);
    g.add(halo);
    g.position.set(side * (mobile ? 13 : 22) + (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 8 - 2, z);
    g.userData.spin = 0.04 + Math.random() * 0.05;
    planets.push(g);
    scene.add(g);
    // Camera passes on the opposite side of each planet, a little above.
    waypoints.push(new Vector3(-side * (mobile ? 3 : 6), 3 + Math.sin(i) * 2, z + 18));
  }
  waypoints.push(new Vector3(0, 4, -chapterCount * SPACING - 60));
  const path = new CatmullRomCurve3(waypoints, false, 'catmullrom', 0.35);

  // ---- ship + engine trail ----
  const ship = buildShip(theme);
  ship.scale.setScalar(mobile ? 0.8 : 1);
  scene.add(ship);
  const TRAIL = mobile ? 40 : 90;
  const trailPos = new Float32Array(TRAIL * 3);
  const trailGeo = new BufferGeometry();
  trailGeo.setAttribute('position', new BufferAttribute(trailPos, 3));
  const trail = new Points(
    trailGeo,
    new PointsMaterial({
      size: 0.5,
      map: glowTexture('rgba(255,255,255,1)'),
      transparent: true,
      opacity: 0.7,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(trail);

  // ---- shooting stars ----
  const shooters: { s: Sprite; v: Vector3; life: number }[] = [];
  const shootTex = glowTexture('rgba(255,255,255,1)');

  function applyTheme() {
    theme = readTheme();
    const blending: Blending = theme.dark ? AdditiveBlending : NormalBlending;
    starLayers.forEach((l, i) => {
      const m = l.material as PointsMaterial;
      m.color.copy(theme.dark ? theme.star : theme.primary);
      m.opacity = theme.dark ? 0.85 - i * 0.1 : 0.35 + i * 0.12;
      m.blending = blending;
      m.needsUpdate = true;
    });
    nebulae.forEach((n, i) => {
      const m = n.material as SpriteMaterial;
      m.color.copy(i % 2 ? theme.accent : theme.primary);
      m.opacity = theme.dark ? 0.12 : 0.1;
      m.blending = blending;
      m.needsUpdate = true;
    });
    ambient.intensity = theme.dark ? 0.35 : 0.9;
    sun.intensity = theme.dark ? 1.8 : 1.3;
    (trail.material as PointsMaterial).color.copy(theme.gold);
    shipLight.color.copy(theme.gold);
  }
  applyTheme();

  // ---- sizing ----
  function resize() {
    const w = canvas.clientWidth || innerWidth;
    const h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  // ---- scroll + pointer ----
  let target = 0;
  let t = 0;
  const readScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    target = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
  };
  readScroll();
  t = target;
  addEventListener('scroll', readScroll, { passive: true });
  const pointer = { x: 0, y: 0 };
  if (!mobile) {
    addEventListener('pointermove', (e) => {
      pointer.x = e.clientX / innerWidth - 0.5;
      pointer.y = e.clientY / innerHeight - 0.5;
    });
  }

  const tmp = new Vector3();
  const ahead = new Vector3();
  let last = performance.now();
  let trailHead = 0;
  let running = true;
  let raf = 0;

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const prev = t;
    t += (target - t) * (reduce ? 1 : Math.min(dt * 3.2, 1));
    const speed = (t - prev) / Math.max(dt, 1e-3);

    // camera
    path.getPointAt(Math.min(t, 0.999), tmp);
    camera.position.copy(tmp);
    camera.position.x += pointer.x * 2.2;
    camera.position.y += -pointer.y * 1.4;
    path.getPointAt(Math.min(t + 0.03, 1), ahead);
    camera.lookAt(ahead);

    // ship sits just ahead of the camera, slightly low, and banks into turns
    path.getPointAt(Math.min(t + 0.012, 1), tmp);
    // Ship flies low and to the right, clear of the left-aligned text.
    ship.position.set(tmp.x + (mobile ? 1.2 : 3.2), tmp.y - (mobile ? 2.6 : 2.4), tmp.z - 2);
    ship.lookAt(ahead.x, ahead.y - 1.5, ahead.z);
    ship.rotation.z += Math.max(Math.min(-speed * 40 + pointer.x * 0.6, 0.6), -0.6);
    ship.position.y += Math.sin(now / 700) * 0.08;
    const flame = ship.userData.flame as Sprite;
    const boost = 1.4 + Math.min(Math.abs(speed) * 60, 1.6) + Math.sin(now / 60) * 0.15;
    flame.scale.set(boost, boost, 1);
    shipLight.position.copy(ship.position);

    // engine trail
    const back = new Vector3(0, 0, 1.9).applyQuaternion(ship.quaternion).add(ship.position);
    trailPos[trailHead * 3] = back.x + (Math.random() - 0.5) * 0.15;
    trailPos[trailHead * 3 + 1] = back.y + (Math.random() - 0.5) * 0.15;
    trailPos[trailHead * 3 + 2] = back.z;
    trailHead = (trailHead + 1) % TRAIL;
    trailGeo.attributes.position.needsUpdate = true;

    // planets turn slowly; stars drift
    planets.forEach((p) => (p.children[0].rotation.y += p.userData.spin * dt));
    starLayers.forEach((l, i) => (l.rotation.z += dt * 0.004 * (i + 1)));

    // shooting stars
    if (!reduce && Math.random() < dt * 0.35 && shooters.length < 3) {
      const s = new Sprite(
        new SpriteMaterial({
          map: shootTex,
          color: theme.dark ? '#fff4dc' : theme.primary,
          transparent: true,
          depthWrite: false,
          blending: theme.dark ? AdditiveBlending : NormalBlending,
        }),
      );
      s.scale.set(3.5, 0.18, 1);
      s.position.set(
        camera.position.x + (Math.random() - 0.3) * 80,
        camera.position.y + 20 + Math.random() * 20,
        camera.position.z - 60 - Math.random() * 60,
      );
      scene.add(s);
      shooters.push({ s, v: new Vector3(-60 - Math.random() * 40, -25, 0), life: 1.2 });
    }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.life -= dt;
      sh.s.position.addScaledVector(sh.v, dt);
      (sh.s.material as SpriteMaterial).opacity = Math.max(sh.life, 0);
      if (sh.life <= 0) {
        scene.remove(sh.s);
        sh.s.material.dispose();
        shooters.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (reduce) return renderOnce();
    if (raf) cancelAnimationFrame(raf);
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
  }
  function renderOnce() {
    running = false;
    frame(performance.now());
  }

  if (reduce) {
    renderOnce();
    addEventListener('scroll', () => requestAnimationFrame(renderOnce), { passive: true });
  } else start();

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  new MutationObserver(() => {
    applyTheme();
    if (reduce) renderOnce();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return { stop, start };
}
