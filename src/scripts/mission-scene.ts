/**
 * "Andromeda Voyage": the homepage is a first-person flight. Scrolling is the
 * throttle; each homepage chapter is a world the ship passes on the way to the
 * Andromeda galaxy, which grows from a smudge to the whole view by the end.
 *
 * Everything is built from primitives, particles and canvas-drawn textures, so
 * there are no model or image files. Original designs throughout.
 *
 * Events out (window): 'voyage:speed' (detail 0..1) for the HUD and sound.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  DoubleSide,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
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
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  BoxGeometry,
} from 'three';

const SPACING = 90;
type World = { group: Group; update?: (dt: number, now: number) => void; z: number };

/* ------------------------------------------------------------------------ */
/* Canvas textures                                                           */
/* ------------------------------------------------------------------------ */
function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function glow(
  stops: [number, string][] = [
    [0, 'rgba(255,255,255,1)'],
    [0.35, 'rgba(255,255,255,0.45)'],
    [1, 'rgba(255,255,255,0)'],
  ],
) {
  return canvasTex(128, 128, (g) => {
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [o, c] of stops) grad.addColorStop(o, c);
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  });
}

function seeded(seed: number) {
  let r = seed * 9301 + 49297;
  return () => (r = (r * 9301 + 49297) % 233280) / 233280;
}

function bands(a: string, b: string, seed: number, stripes = 26) {
  return canvasTex(512, 256, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, a);
    grad.addColorStop(1, b);
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 256);
    const rand = seeded(seed);
    for (let i = 0; i < stripes; i++) {
      const y = rand() * 256;
      const h = 2 + rand() * 18;
      g.fillStyle = `rgba(${rand() > 0.5 ? '255,245,235' : '20,15,40'},${0.05 + rand() * 0.14})`;
      g.beginPath();
      for (let x = 0; x <= 512; x += 16) g.lineTo(x, y + Math.sin(x / 40 + i) * 3);
      g.lineTo(512, y + h);
      for (let x = 512; x >= 0; x -= 16) g.lineTo(x, y + h + Math.sin(x / 50 + i) * 3);
      g.closePath();
      g.fill();
    }
  });
}

function blotches(base: string, spots: string[], seed: number, n = 60, rMax = 40) {
  return canvasTex(512, 256, (g) => {
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 256);
    const rand = seeded(seed);
    for (let i = 0; i < n; i++) {
      const x = rand() * 512;
      const y = 30 + rand() * 196;
      const r = 4 + rand() * rMax;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      const c = spots[Math.floor(rand() * spots.length)];
      grad.addColorStop(0, c);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.beginPath();
      g.ellipse(x, y, r * 1.6, r, 0, 0, Math.PI * 2);
      g.fill();
    }
  });
}

const add = <M extends SpriteMaterial | PointsMaterial | MeshBasicMaterial | LineBasicMaterial>(mat: M): M => {
  mat.blending = AdditiveBlending;
  mat.depthWrite = false;
  mat.transparent = true;
  return mat;
};
const halo = (color: string, scale: number, opacity = 0.5, tex = glow()) => {
  const s = new Sprite(add(new SpriteMaterial({ map: tex, color, opacity })));
  s.scale.set(scale, scale, 1);
  return s;
};

/* ------------------------------------------------------------------------ */
/* Worlds, one per homepage chapter                                          */
/* ------------------------------------------------------------------------ */
function earth(q: Quality): World {
  const g = new Group();
  const tex = blotches('#1d4f8f', ['rgba(70,140,80,0.9)', 'rgba(150,120,70,0.8)', 'rgba(40,110,70,0.9)'], 3, 70, 46);
  const clouds = blotches('rgba(0,0,0,0)', ['rgba(255,255,255,0.75)', 'rgba(255,255,255,0.5)'], 8, 90, 30);
  const planet = new Mesh(
    new SphereGeometry(70, q.seg, q.seg / 2),
    new MeshStandardMaterial({ map: tex, roughness: 0.85 }),
  );
  const sky = new Mesh(
    new SphereGeometry(71, q.seg, q.seg / 2),
    new MeshStandardMaterial({ map: clouds, transparent: true, depthWrite: false }),
  );
  g.add(planet, sky, halo('#5fb0ff', 190, 0.55));
  g.position.set(14, -76, -85);
  return {
    group: g,
    z: -20,
    update: (dt) => {
      planet.rotation.y += dt * 0.01;
      sky.rotation.y += dt * 0.014;
    },
  };
}

function station(): World {
  const g = new Group();
  const metal = new MeshStandardMaterial({ color: '#cfd3ef', metalness: 0.7, roughness: 0.3 });
  const ring = new Mesh(new TorusGeometry(9, 0.9, 12, 64), metal);
  const hub = new Mesh(new CylinderGeometry(1.6, 1.6, 5, 20), metal);
  hub.rotation.x = Math.PI / 2;
  const spokes = new Group();
  for (let i = 0; i < 4; i++) {
    const s = new Mesh(new BoxGeometry(0.4, 18, 0.4), metal);
    s.rotation.z = (i * Math.PI) / 4;
    spokes.add(s);
  }
  const lights = new Group();
  const lit = new MeshBasicMaterial({ color: '#f3c77a' });
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const w = new Mesh(new BoxGeometry(0.5, 0.25, 0.25), lit);
    w.position.set(Math.cos(a) * 9.95, Math.sin(a) * 9.95, 0.5);
    lights.add(w);
  }
  const spin = new Group();
  spin.add(ring, spokes, lights);
  g.add(spin, hub, halo('#a48bff', 40, 0.25));
  g.rotation.set(0.5, -0.6, 0);
  return { group: g, z: 0, update: (dt) => (spin.rotation.z += dt * 0.15) };
}

function asteroids(q: Quality): World {
  const g = new Group();
  const geo = new IcosahedronGeometry(1, 1);
  const p = geo.attributes.position as BufferAttribute;
  const rand = seeded(5);
  for (let i = 0; i < p.count; i++)
    p.setXYZ(
      i,
      p.getX(i) * (0.75 + rand() * 0.5),
      p.getY(i) * (0.75 + rand() * 0.5),
      p.getZ(i) * (0.75 + rand() * 0.5),
    );
  geo.computeVertexNormals();
  const n = q.low ? 70 : 150;
  const mesh = new InstancedMesh(
    geo,
    new MeshStandardMaterial({ color: '#5d5a74', roughness: 0.95, flatShading: true }),
    n,
  );
  const dummy = new Object3D();
  const rocks = Array.from({ length: n }, () => {
    const a = rand() * Math.PI * 2;
    const r = 16 + rand() * 40;
    return {
      pos: new Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.55, (rand() - 0.5) * 120),
      rot: new Vector3(rand() * 6, rand() * 6, rand() * 6),
      spin: new Vector3((rand() - 0.5) * 0.6, (rand() - 0.5) * 0.6, 0),
      s: 0.4 + Math.pow(rand(), 3) * 3.2,
    };
  });
  g.add(mesh);
  const update = (dt: number) => {
    rocks.forEach((k, i) => {
      k.rot.x += k.spin.x * dt;
      k.rot.y += k.spin.y * dt;
      dummy.position.copy(k.pos);
      dummy.rotation.set(k.rot.x, k.rot.y, k.rot.z);
      dummy.scale.setScalar(k.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  update(0);
  return { group: g, z: 0, update };
}

function ringedGiant(q: Quality): World {
  const g = new Group();
  const planet = new Mesh(
    new SphereGeometry(22, q.seg, q.seg / 2),
    new MeshStandardMaterial({ map: bands('#e6b98a', '#7a4f8f', 4, 34), roughness: 0.9 }),
  );
  const ringTex = canvasTex(512, 8, (c) => {
    for (let x = 0; x < 512; x++) {
      const a = 0.25 + 0.6 * Math.abs(Math.sin(x * 0.07) * Math.sin(x * 0.013));
      c.fillStyle = `rgba(240,215,180,${x < 20 || x > 490 ? 0 : a})`;
      c.fillRect(x, 0, 1, 8);
    }
  });
  const rg = new RingGeometry(28, 52, 128, 1);
  const uv = rg.attributes.uv as BufferAttribute;
  const pos = rg.attributes.position as BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getY(i));
    uv.setXY(i, (r - 28) / 24, 0.5);
  }
  const ring = new Mesh(
    rg,
    new MeshBasicMaterial({ map: ringTex, side: DoubleSide, transparent: true, depthWrite: false }),
  );
  ring.rotation.x = Math.PI / 2.3;
  g.add(planet, ring, halo('#ffb88a', 110, 0.28));
  g.rotation.z = 0.25;
  return { group: g, z: 0, update: (dt) => (planet.rotation.y += dt * 0.05) };
}

function shipyard(q: Quality): World {
  const g = new Group();
  const moon = new Mesh(
    new SphereGeometry(12, q.seg, q.seg / 2),
    new MeshStandardMaterial({
      map: blotches('#8a8a99', ['rgba(60,60,75,0.8)', 'rgba(180,180,195,0.6)'], 9, 120, 16),
      roughness: 1,
    }),
  );
  const steel = new MeshStandardMaterial({ color: '#b8bcd8', metalness: 0.6, roughness: 0.4 });
  const frame = new Group();
  for (let i = 0; i < 6; i++) {
    const beam = new Mesh(new BoxGeometry(0.35, 0.35, 22), steel);
    beam.position.set(i % 2 ? 3 : -3, i < 2 ? 3 : i < 4 ? 0 : -3, 0);
    frame.add(beam);
  }
  for (let i = 0; i < 5; i++) {
    const rib = new Mesh(new TorusGeometry(4.3, 0.18, 6, 24), steel);
    rib.position.z = -10 + i * 5;
    frame.add(rib);
  }
  const hullMat = new MeshStandardMaterial({ color: '#e9ecff', metalness: 0.5, roughness: 0.35 });
  const hull = new Mesh(new CylinderGeometry(2.2, 2.8, 14, 16), hullMat);
  hull.rotation.x = Math.PI / 2;
  frame.add(hull);
  const blink: Sprite[] = [];
  for (let i = 0; i < 6; i++) {
    const s = halo(i % 2 ? '#ff6b6b' : '#7fd6a4', 1.6, 0.9);
    s.position.set(i % 2 ? 4.5 : -4.5, i % 3 === 0 ? 3.5 : -3.5, -10 + i * 4);
    blink.push(s);
    frame.add(s);
  }
  frame.position.set(-20, 6, 0);
  frame.rotation.y = 0.5;
  g.add(moon, frame);
  return {
    group: g,
    z: 0,
    update: (_dt, now) =>
      blink.forEach((s, i) => (s.material.opacity = 0.3 + 0.7 * Math.max(0, Math.sin(now / 300 + i)))),
  };
}

function nebulaRelay(): World {
  const g = new Group();
  const tones = ['#7b5cff', '#4cc2ff', '#ff7aa8', '#a48bff', '#5f7dff'];
  const rand = seeded(12);
  const soft = glow([
    [0, 'rgba(255,255,255,0.9)'],
    [0.5, 'rgba(255,255,255,0.25)'],
    [1, 'rgba(255,255,255,0)'],
  ]);
  for (let i = 0; i < 9; i++) {
    const s = halo(tones[i % tones.length], 50 + rand() * 70, 0.2, soft);
    s.position.set((rand() - 0.5) * 60, (rand() - 0.5) * 30, (rand() - 0.5) * 60);
    g.add(s);
  }
  const mast = new Mesh(
    new CylinderGeometry(0.25, 0.6, 14, 8),
    new MeshStandardMaterial({ color: '#dfe3f6', metalness: 0.7, roughness: 0.3 }),
  );
  const dish = new Mesh(
    new ConeGeometry(3, 1.4, 24, 1, true),
    new MeshStandardMaterial({ color: '#eef0ff', side: DoubleSide, metalness: 0.4 }),
  );
  dish.position.y = 7;
  dish.rotation.x = Math.PI;
  const beacon = halo('#f3c77a', 6, 1);
  beacon.position.y = 8;
  g.add(mast, dish, beacon);
  return {
    group: g,
    z: 0,
    update: (_dt, now) => (beacon.material.opacity = 0.35 + 0.65 * Math.abs(Math.sin(now / 500))),
  };
}

function pulsar(): World {
  const g = new Group();
  const core = new Mesh(new SphereGeometry(2.4, 24, 16), new MeshBasicMaterial({ color: '#dff3ff' }));
  const beams = new Group();
  const beamMat = add(new MeshBasicMaterial({ color: '#7fd0ff', opacity: 0.12, side: DoubleSide }));
  for (const dir of [1, -1]) {
    const b = new Mesh(new ConeGeometry(2.6, 48, 24, 1, true), beamMat);
    b.position.y = dir * 24;
    b.rotation.x = dir === 1 ? Math.PI : 0;
    beams.add(b);
  }
  beams.rotation.z = 0.45;
  const spin = new Group();
  spin.add(beams);
  g.add(core, spin, halo('#9fdcff', 26, 0.8), halo('#4cc2ff', 70, 0.25));
  return { group: g, z: 0, update: (dt) => (spin.rotation.y += dt * 2.4) };
}

function iceWorld(q: Quality): World {
  const g = new Group();
  const planet = new Mesh(
    new SphereGeometry(18, q.seg, q.seg / 2),
    new MeshStandardMaterial({ map: bands('#e9f6ff', '#8fb8d9', 21, 40), roughness: 0.35, metalness: 0.1 }),
  );
  g.add(planet, halo('#bfe6ff', 70, 0.35));
  return { group: g, z: 0, update: (dt) => (planet.rotation.y -= dt * 0.04) };
}

function binary(): World {
  const g = new Group();
  const a = new Group();
  const b = new Group();
  a.add(new Mesh(new SphereGeometry(4, 24, 16), new MeshBasicMaterial({ color: '#ffe2a8' })), halo('#f3c77a', 30, 0.7));
  b.add(
    new Mesh(new SphereGeometry(2.6, 24, 16), new MeshBasicMaterial({ color: '#cfe9ff' })),
    halo('#4cc2ff', 22, 0.7),
  );
  const la = new PointLight('#ffd9a0', 30, 120, 1.5);
  const lb = new PointLight('#9fd6ff', 20, 100, 1.5);
  a.add(la);
  b.add(lb);
  g.add(a, b);
  let t = 0;
  return {
    group: g,
    z: 0,
    update: (dt) => {
      t += dt * 0.5;
      a.position.set(Math.cos(t) * 7, Math.sin(t) * 2, Math.sin(t) * 7);
      b.position.set(-Math.cos(t) * 11, -Math.sin(t) * 3, -Math.sin(t) * 11);
    },
  };
}

function wormhole(q: Quality): World {
  const g = new Group();
  const n = q.low ? 2500 : 7000;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const rand = seeded(31);
  const c1 = new Color('#a48bff');
  const c2 = new Color('#4cc2ff');
  const c3 = new Color('#fff1d6');
  for (let i = 0; i < n; i++) {
    const r = 3 + Math.pow(rand(), 0.6) * 26;
    const a = rand() * Math.PI * 2 + r * 0.35;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.sin(a) * r;
    pos[i * 3 + 2] = (rand() - 0.5) * (30 / r);
    const c = r < 6 ? c3 : rand() < 0.5 ? c1 : c2;
    col.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(col, 3));
  const swirl = new Points(geo, add(new PointsMaterial({ size: 0.5, map: glow(), vertexColors: true, opacity: 0.9 })));
  const throat = new Mesh(new SphereGeometry(2.6, 24, 16), new MeshBasicMaterial({ color: '#02030a' }));
  const lip = new Mesh(
    new TorusGeometry(3.2, 0.25, 12, 64),
    add(new MeshBasicMaterial({ color: '#d9ccff', opacity: 0.9 })),
  );
  g.add(swirl, throat, lip, halo('#7b5cff', 40, 0.45));
  g.rotation.set(0.2, 0.9, 0);
  return { group: g, z: 0, update: (dt) => (swirl.rotation.z += dt * 0.5) };
}

function blackHole(): World {
  const g = new Group();
  const hole = new Mesh(new SphereGeometry(8, 48, 32), new MeshBasicMaterial({ color: '#000000' }));
  const diskTex = canvasTex(256, 256, (c) => {
    const grad = c.createRadialGradient(128, 128, 40, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.06, 'rgba(255,250,235,1)');
    grad.addColorStop(0.25, 'rgba(255,205,130,0.9)');
    grad.addColorStop(0.55, 'rgba(240,120,60,0.45)');
    grad.addColorStop(1, 'rgba(120,40,120,0)');
    c.fillStyle = grad;
    c.fillRect(0, 0, 256, 256);
  });
  const disk = new Mesh(
    new RingGeometry(9, 34, 128),
    add(new MeshBasicMaterial({ map: diskTex, side: DoubleSide, opacity: 0.95 })),
  );
  // Remap UVs so the radial texture follows the ring.
  const uv = disk.geometry.attributes.uv as BufferAttribute;
  const p = disk.geometry.attributes.position as BufferAttribute;
  for (let i = 0; i < p.count; i++) uv.setXY(i, 0.5 + p.getX(i) / 68, 0.5 + p.getY(i) / 68);
  disk.rotation.x = Math.PI / 2.15;
  const lens = new Mesh(
    new TorusGeometry(9.6, 0.9, 16, 96),
    add(new MeshBasicMaterial({ color: '#ffd9a0', opacity: 0.55 })),
  );
  g.add(disk, lens, hole, halo('#ffb070', 90, 0.35));
  return { group: g, z: 0, update: (dt) => (disk.rotation.z += dt * 0.25) };
}

const BUILDERS: Record<string, (q: Quality) => World> = {
  launch: earth,
  proof: station,
  process: asteroids,
  impact: ringedGiant,
  projects: shipyard,
  newsletter: nebulaRelay,
  'on-air': pulsar,
  claude: iceWorld,
  toolbox: binary,
  journey: wormhole,
  contact: blackHole,
};

/* ------------------------------------------------------------------------ */
/* Andromeda: an original procedural spiral of glowing particles              */
/* ------------------------------------------------------------------------ */
function andromeda(q: Quality) {
  const n = q.low ? 16000 : 60000;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const rand = seeded(77);
  const core = new Color('#fff1d6');
  const warm = new Color('#f3c77a');
  const arm = new Color('#a48bff');
  const blue = new Color('#7fc8ff');
  const pink = new Color('#ff8fb8');
  const R = 260;
  for (let i = 0; i < n; i++) {
    const inCore = rand() < 0.22;
    let x: number, y: number, z: number;
    const c = new Color();
    if (inCore) {
      const r = Math.pow(rand(), 2.2) * R * 0.22;
      const a = rand() * Math.PI * 2;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r;
      z = (rand() - 0.5) * 18 * (1 - r / (R * 0.22));
      c.copy(core).lerp(warm, r / (R * 0.22));
    } else {
      const armIdx = rand() < 0.5 ? 0 : Math.PI;
      const t = Math.pow(rand(), 0.8);
      const r = R * (0.12 + t * 0.88);
      const a = armIdx + t * 4.6 + (rand() - 0.5) * (0.5 + t * 0.4);
      const spread = (rand() - 0.5) * 22 * (0.4 + t);
      x = Math.cos(a) * r + spread;
      y = Math.sin(a) * r + (rand() - 0.5) * 22 * (0.4 + t);
      z = (rand() - 0.5) * 10;
      c.copy(rand() < 0.6 ? arm : blue).lerp(warm, (1 - t) * 0.5);
      if (rand() < 0.04) c.copy(pink);
    }
    pos.set([x, y, z], i * 3);
    const dim = 0.55 + rand() * 0.45;
    col.set([c.r * dim, c.g * dim, c.b * dim], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(col, 3));
  const pts = new Points(
    geo,
    add(new PointsMaterial({ size: q.low ? 2.6 : 2, map: glow(), vertexColors: true, opacity: 0.85, fog: false })),
  );
  const g = new Group();
  const coreGlow = halo('#ffe8c0', 160, 0.75);
  const outerGlow = halo('#a48bff', 620, 0.18);
  coreGlow.material.fog = false;
  outerGlow.material.fog = false;
  g.add(pts, coreGlow, outerGlow);
  g.scale.y = 0.42; // seen at an angle, like the real galaxy
  g.rotation.set(-0.3, 0.2, -0.55);
  return { group: g, spin: pts };
}

type Quality = { low: boolean; seg: number };

export function startMissionScene(canvas: HTMLCanvasElement, chapterIds: string[]) {
  const mobile = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const low = mobile || (navigator.hardwareConcurrency ?? 8) <= 4;
  const q: Quality = { low, seg: low ? 32 : 64 };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !low, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null; // No WebGL: the CSS galaxy behind the canvas stays as the fallback.
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, low ? 1.25 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  // Depth fog in the void colour: worlds emerge from the dark as you approach,
  // so only the next one or two are ever in view.
  scene.fog = new Fog('#070814', 110, 270);
  const baseFov = mobile ? 74 : 62;
  const camera = new PerspectiveCamera(baseFov, 1, 0.1, 4000);
  scene.add(camera);

  scene.add(new AmbientLight('#8f95c8', 0.45));
  const sun = new DirectionalLight('#ffe9c8', 2.2);
  sun.position.set(-60, 40, 40);
  scene.add(sun);

  // Distant star shell, centred on the camera so it never runs out.
  const shell = (() => {
    const n = low ? 1500 : 4000;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = 900 + Math.random() * 600;
      const s = Math.sqrt(1 - u * u);
      pos.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    return new Points(
      geo,
      add(new PointsMaterial({ size: 3.2, map: glow(), color: '#eef0ff', opacity: 0.85, fog: false })),
    );
  })();
  scene.add(shell);

  // Near "streak" stars, attached to the camera. They stretch into warp lines with speed.
  const STREAKS = low ? 260 : 650;
  const streakPos = new Float32Array(STREAKS * 6);
  const seeds = Array.from({ length: STREAKS }, () => {
    const a = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 55;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7, z: -2 - Math.random() * 260 };
  });
  const streakGeo = new BufferGeometry();
  streakGeo.setAttribute('position', new BufferAttribute(streakPos, 3));
  const streakMat = add(new LineBasicMaterial({ color: '#dfe3ff', opacity: 0.5, fog: false }));
  const streaks = new LineSegments(streakGeo, streakMat);
  streaks.frustumCulled = false;
  camera.add(streaks);

  // Worlds, placed along the route in chapter order.
  const worlds: World[] = chapterIds.map((id, i) => {
    const w = (BUILDERS[id] ?? iceWorld)(q);
    const side = i % 2 === 0 ? 1 : -1;
    const z = -i * SPACING - 40;
    if (id !== 'launch') {
      const off = id === 'process' ? 0 : id === 'journey' ? 14 : mobile ? 24 : 34;
      w.group.position.set(side * off, (i % 3) * 4 - 4, z);
    }
    w.z = id === 'launch' ? -85 : z;
    scene.add(w.group);
    return w;
  });

  const end = -(chapterIds.length - 1) * SPACING - 40;
  const galaxy = andromeda(q);
  galaxy.group.position.set(30, 40, end - 520);
  scene.add(galaxy.group);

  function resize() {
    const w = canvas.clientWidth || innerWidth;
    const h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', () => {
    resize();
    measure();
  });

  // Scroll → route position u (chapter index + fraction), synced to the real sections.
  let tops: number[] = [];
  const sections = chapterIds.map((id) => document.getElementById(id));
  function measure() {
    tops = sections.map((s) => (s ? s.getBoundingClientRect().top + scrollY : 0));
    tops.push(document.documentElement.scrollHeight);
  }
  measure();
  addEventListener('load', measure);
  setTimeout(measure, 1500);
  let target = 0;
  const readScroll = () => {
    const y = scrollY + innerHeight * 0.5;
    let i = 0;
    while (i < tops.length - 2 && y >= tops[i + 1]) i++;
    const span = Math.max(tops[i + 1] - tops[i], 1);
    target = Math.min(i + Math.min(Math.max((y - tops[i]) / span, 0), 1), chapterIds.length);
  };
  readScroll();
  let u = target;
  addEventListener('scroll', readScroll, { passive: true });
  const pointer = { x: 0, y: 0 };
  if (!mobile)
    addEventListener(
      'pointermove',
      (e) => ((pointer.x = e.clientX / innerWidth - 0.5), (pointer.y = e.clientY / innerHeight - 0.5)),
    );

  const routeAt = (k: number, out: Vector3) =>
    out.set(Math.sin(k * 0.9) * 5, Math.cos(k * 0.7) * 3 + 2, -k * SPACING + 10);
  const camPos = new Vector3();
  const look = new Vector3();
  let warp = 0;
  let lastEmit = 0;
  let last = performance.now();
  let raf = 0;
  let running = true;

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const prev = u;
    u += (target - u) * (reduce ? 1 : Math.min(dt * 2.6, 1));
    const speed = Math.abs(u - prev) / Math.max(dt, 1e-3);
    warp += (Math.min(speed / 1.6, 1) - warp) * Math.min(dt * 4, 1);

    // Camera along the route, looking ahead and leaning toward the nearest world.
    routeAt(u, camPos);
    camera.position.copy(camPos);
    camera.position.x += pointer.x * 3;
    camera.position.y += -pointer.y * 2;
    if (!reduce && !mobile && warp > 0.35) {
      camera.position.x += (Math.random() - 0.5) * warp * 0.25;
      camera.position.y += (Math.random() - 0.5) * warp * 0.25;
    }
    routeAt(u + 0.7, look);
    const near = worlds[Math.min(Math.round(u), worlds.length - 1)];
    if (near && chapterIds[Math.round(u)] !== 'launch') {
      const d = Math.abs(near.z - camPos.z);
      const k = Math.max(0, 1 - d / 140) * 0.22;
      look.lerp(near.group.position, k);
    }
    if (u > chapterIds.length - 1.6)
      look.lerp(galaxy.group.position, Math.min((u - (chapterIds.length - 1.6)) * 0.6, 0.6));
    camera.lookAt(look);
    camera.rotation.z += pointer.x * -0.04;
    const fov = baseFov + warp * 10;
    if (Math.abs(camera.fov - fov) > 0.05) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    shell.position.copy(camera.position);

    // Streaks: drift toward the camera, longer and brighter at speed.
    const vz = (reduce ? 0 : 6) + warp * 260;
    const len = 0.25 + warp * 22;
    for (let i = 0; i < STREAKS; i++) {
      const s = seeds[i];
      s.z += vz * dt;
      if (s.z > -1) {
        s.z -= 260;
        const a = Math.random() * Math.PI * 2;
        const r = 4 + Math.random() * 55;
        s.x = Math.cos(a) * r;
        s.y = Math.sin(a) * r * 0.7;
      }
      streakPos.set([s.x, s.y, s.z, s.x, s.y, s.z - len], i * 6);
    }
    streakGeo.attributes.position.needsUpdate = true;
    streakMat.opacity = 0.35 + warp * 0.55;

    for (const w of worlds) {
      if (Math.abs(w.z - camPos.z) < 600) w.update?.(dt, now);
    }
    galaxy.spin.rotation.z += dt * 0.006;

    if (now - lastEmit > 100) {
      lastEmit = now;
      dispatchEvent(new CustomEvent('voyage:speed', { detail: warp }));
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
  return { stop, start };
}
