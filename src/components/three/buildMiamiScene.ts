import * as THREE from 'three';
import type { ViceThemeId } from '../../types/theme';

export type TimeOfDayMode = 'day' | 'sunset' | 'night';

export interface MiamiTimeLighting {
  skyTop: THREE.Color;
  skyMid: THREE.Color;
  skyHorizon: THREE.Color;
  fogColor: THREE.Color;
  fogDensity: number;
  sunCore: THREE.Color;
  sunGlow: THREE.Color;
  sunY: number;
  sunScale: number;
  sunBandOpacity: number;
  oceanColor: THREE.Color;
  palmFrondColor: THREE.Color;
  neonPrimary: THREE.Color;
  neonSecondary: THREE.Color;
  keyLight: THREE.Color;
  keyIntensity: number;
  fillLight: THREE.Color;
  fillIntensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  envIntensity: number;
  starOpacity: number;
  lampEmissive: number;
  curbEmissive: number;
  headlightBeamOpacity: number;
  headlightEmissive: number;
  underglowOpacity: number;
  carBody: THREE.Color;
}

const DAY_LIGHTING: MiamiTimeLighting = {
  skyTop: new THREE.Color('#1B75D0'),
  skyMid: new THREE.Color('#56B4EE'),
  skyHorizon: new THREE.Color('#FFEBD4'),
  fogColor: new THREE.Color('#B5DFF5'),
  fogDensity: 0.0042,
  sunCore: new THREE.Color('#FFFBE0'),
  sunGlow: new THREE.Color('#FFE09A'),
  sunY: 42,
  sunScale: 0.68,
  sunBandOpacity: 0.0,
  oceanColor: new THREE.Color('#127696'),
  palmFrondColor: new THREE.Color('#236E45'),
  neonPrimary: new THREE.Color('#FF6D96'),
  neonSecondary: new THREE.Color('#42C6DB'),
  keyLight: new THREE.Color('#FFF4DE'),
  keyIntensity: 2.95,
  fillLight: new THREE.Color('#9ED8FF'),
  fillIntensity: 1.15,
  hemiSky: new THREE.Color('#C4E8FF'),
  hemiGround: new THREE.Color('#5C6C7A'),
  hemiIntensity: 1.35,
  envIntensity: 1.05,
  starOpacity: 0.0,
  lampEmissive: 0.15,
  curbEmissive: 0.25,
  headlightBeamOpacity: 0.02,
  headlightEmissive: 0.65,
  underglowOpacity: 0.05,
  carBody: new THREE.Color('#F7E2D8'),
};

const NIGHT_LIGHTING: MiamiTimeLighting = {
  skyTop: new THREE.Color('#02040D'),
  skyMid: new THREE.Color('#0C102B'),
  skyHorizon: new THREE.Color('#28194D'),
  fogColor: new THREE.Color('#0C0E24'),
  fogDensity: 0.0125,
  sunCore: new THREE.Color('#EBF4FF'),
  sunGlow: new THREE.Color('#8EB8FF'),
  sunY: 32,
  sunScale: 0.56,
  sunBandOpacity: 0.0,
  oceanColor: new THREE.Color('#050C1C'),
  palmFrondColor: new THREE.Color('#0C1E1B'),
  neonPrimary: new THREE.Color('#FF428B'),
  neonSecondary: new THREE.Color('#59E6FF'),
  keyLight: new THREE.Color('#8AB4FF'),
  keyIntensity: 1.15,
  fillLight: new THREE.Color('#D16BFF'),
  fillIntensity: 1.35,
  hemiSky: new THREE.Color('#2D386E'),
  hemiGround: new THREE.Color('#100A1D'),
  hemiIntensity: 0.62,
  envIntensity: 0.55,
  starOpacity: 0.95,
  lampEmissive: 3.4,
  curbEmissive: 2.35,
  headlightBeamOpacity: 0.26,
  headlightEmissive: 4.4,
  underglowOpacity: 0.36,
  carBody: new THREE.Color('#E3D7E8'),
};

const SUNSET_BY_THEME: Record<ViceThemeId, MiamiTimeLighting> = {
  vice: {
    skyTop: new THREE.Color('#0E0A1F'),
    skyMid: new THREE.Color('#471949'),
    skyHorizon: new THREE.Color('#F26B7A'),
    fogColor: new THREE.Color('#2A1230'),
    fogDensity: 0.0105,
    sunCore: new THREE.Color('#FFE69C'),
    sunGlow: new THREE.Color('#FF6A7D'),
    sunY: 16,
    sunScale: 1.0,
    sunBandOpacity: 0.65,
    oceanColor: new THREE.Color('#0C1829'),
    palmFrondColor: new THREE.Color('#133128'),
    neonPrimary: new THREE.Color('#FF5A8A'),
    neonSecondary: new THREE.Color('#5CE1E6'),
    keyLight: new THREE.Color('#FFB17A'),
    keyIntensity: 2.35,
    fillLight: new THREE.Color('#7AC8DB'),
    fillIntensity: 1.15,
    hemiSky: new THREE.Color('#FFB17A'),
    hemiGround: new THREE.Color('#0C1829'),
    hemiIntensity: 0.9,
    envIntensity: 0.8,
    starOpacity: 0.28,
    lampEmissive: 2.1,
    curbEmissive: 1.45,
    headlightBeamOpacity: 0.13,
    headlightEmissive: 2.8,
    underglowOpacity: 0.24,
    carBody: new THREE.Color('#F0D4C8'),
  },
  golden: {
    skyTop: new THREE.Color('#140D0C'),
    skyMid: new THREE.Color('#5A281E'),
    skyHorizon: new THREE.Color('#F3B463'),
    fogColor: new THREE.Color('#2B1611'),
    fogDensity: 0.0095,
    sunCore: new THREE.Color('#FFF2C2'),
    sunGlow: new THREE.Color('#F29E4C'),
    sunY: 17,
    sunScale: 1.04,
    sunBandOpacity: 0.6,
    oceanColor: new THREE.Color('#101B21'),
    palmFrondColor: new THREE.Color('#183629'),
    neonPrimary: new THREE.Color('#F5C86B'),
    neonSecondary: new THREE.Color('#6BC5B8'),
    keyLight: new THREE.Color('#FFD28A'),
    keyIntensity: 2.5,
    fillLight: new THREE.Color('#7EC9BE'),
    fillIntensity: 1.1,
    hemiSky: new THREE.Color('#FFD28A'),
    hemiGround: new THREE.Color('#1A1410'),
    hemiIntensity: 0.95,
    envIntensity: 0.86,
    starOpacity: 0.2,
    lampEmissive: 1.9,
    curbEmissive: 1.35,
    headlightBeamOpacity: 0.11,
    headlightEmissive: 2.4,
    underglowOpacity: 0.2,
    carBody: new THREE.Color('#F5E3C3'),
  },
  midnight: {
    skyTop: new THREE.Color('#050814'),
    skyMid: new THREE.Color('#1A1A4A'),
    skyHorizon: new THREE.Color('#6B5CE7'),
    fogColor: new THREE.Color('#11122E'),
    fogDensity: 0.0115,
    sunCore: new THREE.Color('#B5F0FF'),
    sunGlow: new THREE.Color('#B584FF'),
    sunY: 18,
    sunScale: 0.92,
    sunBandOpacity: 0.45,
    oceanColor: new THREE.Color('#071022'),
    palmFrondColor: new THREE.Color('#102624'),
    neonPrimary: new THREE.Color('#6DD5ED'),
    neonSecondary: new THREE.Color('#F072A5'),
    keyLight: new THREE.Color('#9ED8FF'),
    keyIntensity: 2.0,
    fillLight: new THREE.Color('#C78BFF'),
    fillIntensity: 1.25,
    hemiSky: new THREE.Color('#7FA8FF'),
    hemiGround: new THREE.Color('#080C1C'),
    hemiIntensity: 0.8,
    envIntensity: 0.72,
    starOpacity: 0.55,
    lampEmissive: 2.6,
    curbEmissive: 1.8,
    headlightBeamOpacity: 0.18,
    headlightEmissive: 3.4,
    underglowOpacity: 0.28,
    carBody: new THREE.Color('#DCE8F7'),
  },
};

export function getMiamiLighting(theme: ViceThemeId, timeOfDay: TimeOfDayMode): MiamiTimeLighting {
  if (timeOfDay === 'day') return DAY_LIGHTING;
  if (timeOfDay === 'night') return NIGHT_LIGHTING;
  return SUNSET_BY_THEME[theme];
}

export interface BuiltCouple {
  group: THREE.Group;
  groomHead: THREE.Group;
  brideHead: THREE.Group;
  brideVeilSegments: THREE.Mesh[];
  brideRightArm: THREE.Group;
}

export interface BuiltConvertible {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  couple: BuiltCouple;
  wheels: THREE.Group[];
  frontWheelPivots: THREE.Group[];
  bodyMaterial: THREE.MeshPhysicalMaterial;
  tailLightMaterial: THREE.MeshStandardMaterial;
  headlightMaterial: THREE.MeshStandardMaterial;
  headlightBeamMaterial: THREE.MeshBasicMaterial;
  underglowMaterial: THREE.MeshBasicMaterial;
}

export interface BuiltPalmRow {
  palms: THREE.Group[];
  frondGroups: THREE.Group[];
  frondMaterial: THREE.MeshStandardMaterial;
  spacing: number;
  countPerSide: number;
}

export interface BuiltLampRow {
  lamps: THREE.Group[];
  bulbMaterials: THREE.MeshStandardMaterial[];
  spacing: number;
  countPerSide: number;
}

export interface BuiltWaypointGate {
  group: THREE.Group;
  outerRing: THREE.Mesh;
  innerRing: THREE.Mesh;
  beacon: THREE.Mesh;
  ringMaterial: THREE.MeshStandardMaterial;
  beaconMaterial: THREE.MeshBasicMaterial;
  laneX: number;
  eventIndex: number;
  collectedThisPass: boolean;
}

export interface BuiltSparkBurst {
  points: THREE.Points;
  velocities: Float32Array;
  life: number;
  active: boolean;
  material: THREE.PointsMaterial;
}

function createRoadTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1C1C26';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = 22 + Math.floor(Math.random() * 24);
    ctx.fillStyle = `rgb(${shade},${shade},${shade + 6})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const tracks = [110, 162, 232, 280, 350, 402];
  ctx.fillStyle = 'rgba(8, 8, 14, 0.28)';
  for (const tx of tracks) {
    ctx.fillRect(tx - 10, 0, 20, 512);
  }

  ctx.fillStyle = '#E8DFD5';
  ctx.fillRect(24, 0, 8, 512);
  ctx.fillRect(480, 0, 8, 512);

  ctx.fillStyle = '#F2C97D';
  for (let y = 16; y < 512; y += 96) {
    ctx.fillRect(172, y, 8, 48);
    ctx.fillRect(332, y, 8, 48);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 18);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  return tex;
}

function createLicensePlateTexture(
  plateTitle: string,
  plateDate: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#FFF6EB');
  grad.addColorStop(0.55, '#F9D69E');
  grad.addColorStop(1, '#F26B8A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#12101A';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 236);

  ctx.fillStyle = '#12101A';
  ctx.font = '700 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MIAMI BEACH · FLORIDA', 256, 56);

  ctx.font = '900 76px sans-serif';
  ctx.fillText(plateTitle.toUpperCase().slice(0, 11), 256, 154);

  ctx.font = '700 26px monospace';
  ctx.fillText(plateDate.toUpperCase().slice(0, 18), 256, 214);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  return tex;
}

export function createSkyBackdrop(lighting: MiamiTimeLighting): {
  skyMesh: THREE.Mesh;
  skyMaterial: THREE.ShaderMaterial;
  sunGroup: THREE.Group;
  sunCoreMat: THREE.MeshBasicMaterial;
  sunHaloMat: THREE.MeshBasicMaterial;
  sunBandMat: THREE.MeshBasicMaterial;
  starPoints: THREE.Points;
  starMaterial: THREE.PointsMaterial;
} {
  const skyGeo = new THREE.SphereGeometry(180, 32, 20);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTop: { value: lighting.skyTop.clone() },
      uMid: { value: lighting.skyMid.clone() },
      uHorizon: { value: lighting.skyHorizon.clone() },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 uTop;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos).y;
        float t1 = smoothstep(-0.04, 0.22, h);
        float t2 = smoothstep(0.18, 0.72, h);
        vec3 col = mix(uHorizon, uMid, t1);
        col = mix(col, uTop, t2);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const skyMesh = new THREE.Mesh(skyGeo, skyMaterial);

  // Sun / Moon disc that moves smoothly with Day / Sunset / Night
  const sunGroup = new THREE.Group();
  sunGroup.position.set(0, lighting.sunY, -132);

  const sunCoreMat = new THREE.MeshBasicMaterial({
    color: lighting.sunCore.clone(),
    fog: false,
  });
  const sunCore = new THREE.Mesh(new THREE.CircleGeometry(18, 48), sunCoreMat);
  sunGroup.add(sunCore);

  const sunHaloMat = new THREE.MeshBasicMaterial({
    color: lighting.sunGlow.clone(),
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  const sunHalo = new THREE.Mesh(new THREE.CircleGeometry(31, 48), sunHaloMat);
  sunHalo.position.z = -0.4;
  sunGroup.add(sunHalo);

  const sunBandMat = new THREE.MeshBasicMaterial({
    color: lighting.skyHorizon.clone(),
    transparent: true,
    opacity: lighting.sunBandOpacity,
    fog: false,
  });
  const bandOffsets = [-11.5, -8.2, -5.2, -2.6];
  const bandHeights = [1.45, 1.05, 0.72, 0.44];
  bandOffsets.forEach((by, idx) => {
    const band = new THREE.Mesh(new THREE.PlaneGeometry(38, bandHeights[idx]), sunBandMat);
    band.position.set(0, by, 0.15);
    sunGroup.add(band);
  });

  // 3D Starfield for Night & Dusk skies
  const starCount = 320;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.44;
    const r = 160;
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.cos(phi) + 6;
    starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: '#F4F8FF',
    size: 1.05,
    transparent: true,
    opacity: lighting.starOpacity,
    fog: false,
    depthWrite: false,
  });
  const starPoints = new THREE.Points(starGeo, starMaterial);

  return {
    skyMesh,
    skyMaterial,
    sunGroup,
    sunCoreMat,
    sunHaloMat,
    sunBandMat,
    starPoints,
    starMaterial,
  };
}

export function buildMiamiSkyline(lighting: MiamiTimeLighting): {
  group: THREE.Group;
  windowMaterials: THREE.MeshBasicMaterial[];
} {
  const group = new THREE.Group();
  const buildingMat = new THREE.MeshStandardMaterial({
    color: '#171526',
    roughness: 0.82,
    metalness: 0.15,
  });
  const windowPrimary = new THREE.MeshBasicMaterial({
    color: lighting.neonPrimary.clone(),
    fog: true,
  });
  const windowSecondary = new THREE.MeshBasicMaterial({
    color: lighting.neonSecondary.clone(),
    fog: true,
  });

  const specs = [
    { x: -58, w: 9, h: 24, d: 8 },
    { x: -46, w: 7, h: 36, d: 8 },
    { x: -35, w: 8, h: 20, d: 7 },
    { x: -24, w: 6, h: 15, d: 6 },
    { x: 24, w: 6, h: 16, d: 6 },
    { x: 35, w: 8, h: 27, d: 8 },
    { x: 47, w: 9, h: 40, d: 9 },
    { x: 60, w: 8, h: 22, d: 8 },
  ];

  specs.forEach((b, i) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), buildingMat);
    tower.position.set(b.x, b.h / 2 - 0.5, -118);
    group.add(tower);

    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(b.w + 0.15, 0.45, 0.3),
      i % 2 === 0 ? windowPrimary : windowSecondary
    );
    strip.position.set(b.x, b.h - 1.1, -118 + b.d / 2 + 0.12);
    group.add(strip);
  });

  return { group, windowMaterials: [windowPrimary, windowSecondary] };
}

export function buildCausewayEnvironment(
  lighting: MiamiTimeLighting,
  maxAnisotropy: number
): {
  group: THREE.Group;
  roadTexture: THREE.CanvasTexture;
  oceanMaterial: THREE.MeshStandardMaterial;
  curbNeonMaterial: THREE.MeshStandardMaterial;
} {
  const group = new THREE.Group();

  const roadTexture = createRoadTexture(maxAnisotropy);
  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTexture,
    roughness: 0.42,
    metalness: 0.16,
  });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 220), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0, -68);
  road.receiveShadow = true;
  group.add(road);

  const curbMat = new THREE.MeshStandardMaterial({
    color: '#2F2A3B',
    roughness: 0.78,
    metalness: 0.08,
  });
  const curbNeonMaterial = new THREE.MeshStandardMaterial({
    color: lighting.neonPrimary.clone(),
    emissive: lighting.neonPrimary.clone(),
    emissiveIntensity: lighting.curbEmissive,
    roughness: 0.3,
  });

  [-6.8, 6.8].forEach((cx) => {
    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.36, 220), curbMat);
    sidewalk.position.set(cx, 0.16, -68);
    sidewalk.receiveShadow = true;
    group.add(sidewalk);

    const neonRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 220), curbNeonMaterial);
    neonRail.position.set(cx > 0 ? cx - 1.12 : cx + 1.12, 0.32, -68);
    group.add(neonRail);
  });

  const oceanMaterial = new THREE.MeshStandardMaterial({
    color: lighting.oceanColor.clone(),
    roughness: 0.18,
    metalness: 0.68,
  });
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(340, 260), oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, -0.32, -82);
  group.add(ocean);

  return { group, roadTexture, oceanMaterial, curbNeonMaterial };
}

function createSinglePalmTree(
  trunkMat: THREE.MeshStandardMaterial,
  frondMat: THREE.MeshStandardMaterial,
  leanSign: number
): { palm: THREE.Group; fronds: THREE.Group } {
  const palm = new THREE.Group();

  let currentY = 0;
  let currentX = 0;
  const segCount = 5;
  const segHeight = 1.45;
  for (let i = 0; i < segCount; i++) {
    const rBottom = 0.24 - i * 0.025;
    const rTop = 0.215 - i * 0.025;
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rBottom, segHeight, 7),
      trunkMat
    );
    const tilt = leanSign * (0.045 + i * 0.032);
    seg.position.set(currentX, currentY + segHeight * 0.5, 0);
    seg.rotation.z = -tilt;
    palm.add(seg);
    currentX += Math.sin(tilt) * segHeight * 0.85;
    currentY += Math.cos(tilt) * segHeight * 0.94;
  }

  const fronds = new THREE.Group();
  fronds.position.set(currentX, currentY, 0);

  const frondCount = 7;
  for (let f = 0; f < frondCount; f++) {
    const angle = (f / frondCount) * Math.PI * 2 + (leanSign > 0 ? 0.3 : -0.3);
    const frondPivot = new THREE.Group();
    frondPivot.rotation.y = angle;

    const innerLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 1.85), frondMat);
    innerLeaf.position.set(0, 0.22, 0.92);
    innerLeaf.rotation.x = -0.24;
    frondPivot.add(innerLeaf);

    const outerLeaf = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.95, 4), frondMat);
    outerLeaf.rotation.x = Math.PI * 0.68;
    outerLeaf.scale.set(1, 1, 0.16);
    outerLeaf.position.set(0, -0.08, 2.55);
    frondPivot.add(outerLeaf);

    fronds.add(frondPivot);
  }

  palm.add(fronds);
  return { palm, fronds };
}

export function buildPalmRow(lighting: MiamiTimeLighting): BuiltPalmRow {
  const palms: THREE.Group[] = [];
  const frondGroups: THREE.Group[] = [];
  const spacing = 14;
  const countPerSide = 9;

  const trunkMat = new THREE.MeshStandardMaterial({
    color: '#4A332B',
    roughness: 0.92,
    metalness: 0.02,
  });
  const frondMaterial = new THREE.MeshStandardMaterial({
    color: lighting.palmFrondColor.clone(),
    roughness: 0.72,
    metalness: 0.06,
  });

  for (let i = 0; i < countPerSide; i++) {
    const z = 14 - i * spacing;
    const left = createSinglePalmTree(trunkMat, frondMaterial, -1);
    left.palm.position.set(-7.1, 0.25, z);
    left.palm.scale.setScalar(0.92 + (i % 3) * 0.08);
    palms.push(left.palm);
    frondGroups.push(left.fronds);

    const right = createSinglePalmTree(trunkMat, frondMaterial, 1);
    right.palm.position.set(7.1, 0.25, z - spacing * 0.45);
    right.palm.scale.setScalar(0.95 + ((i + 1) % 3) * 0.07);
    palms.push(right.palm);
    frondGroups.push(right.fronds);
  }

  return { palms, frondGroups, frondMaterial, spacing, countPerSide };
}

export function buildArtDecoLamps(lighting: MiamiTimeLighting): BuiltLampRow {
  const lamps: THREE.Group[] = [];
  const spacing = 22;
  const countPerSide = 6;

  const poleMat = new THREE.MeshStandardMaterial({
    color: '#C7CFD9',
    metalness: 0.88,
    roughness: 0.24,
  });
  const warmBulb = new THREE.MeshStandardMaterial({
    color: lighting.neonSecondary.clone(),
    emissive: lighting.neonSecondary.clone(),
    emissiveIntensity: lighting.lampEmissive,
    roughness: 0.2,
  });

  for (let i = 0; i < countPerSide; i++) {
    const z = 10 - i * spacing;
    [-6.15, 6.15].forEach((sideX) => {
      const lamp = new THREE.Group();
      const sign = sideX < 0 ? 1 : -1;

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 5.2, 8), poleMat);
      pole.position.y = 2.6;
      lamp.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.08), poleMat);
      arm.position.set(sign * 0.5, 5.1, 0);
      lamp.add(arm);

      const fixture = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), warmBulb);
      fixture.position.set(sign * 0.98, 4.98, 0);
      lamp.add(fixture);

      lamp.position.set(sideX, 0.25, z);
      lamps.push(lamp);
    });
  }

  return { lamps, bulbMaterials: [warmBulb], spacing, countPerSide };
}

function buildSeatedWeddingCouple(): BuiltCouple {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: '#E6B692',
    roughness: 0.62,
    metalness: 0.04,
  });
  const tuxMat = new THREE.MeshStandardMaterial({
    color: '#12131E',
    roughness: 0.68,
    metalness: 0.08,
  });
  const whiteShirtMat = new THREE.MeshStandardMaterial({
    color: '#FAF6F0',
    roughness: 0.52,
    metalness: 0.02,
  });
  const dressMat = new THREE.MeshPhysicalMaterial({
    color: '#FFF9F2',
    roughness: 0.36,
    metalness: 0.04,
    clearcoat: 0.25,
  });
  const groomHairMat = new THREE.MeshStandardMaterial({
    color: '#221712',
    roughness: 0.78,
    metalness: 0.06,
  });
  const brideHairMat = new THREE.MeshStandardMaterial({
    color: '#4A2B1D',
    roughness: 0.65,
    metalness: 0.08,
  });
  const glassesMat = new THREE.MeshPhysicalMaterial({
    color: '#0D0E14',
    roughness: 0.12,
    metalness: 0.72,
    clearcoat: 1.0,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: '#F2C97D',
    metalness: 0.92,
    roughness: 0.18,
  });
  const veilMat = new THREE.MeshPhysicalMaterial({
    color: '#FFFDF8',
    roughness: 0.3,
    metalness: 0.0,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
  });
  const bouquetRoseMat = new THREE.MeshStandardMaterial({
    color: '#F26386',
    roughness: 0.55,
  });
  const bouquetPeachMat = new THREE.MeshStandardMaterial({
    color: '#F7B07C',
    roughness: 0.55,
  });
  const bouquetLeafMat = new THREE.MeshStandardMaterial({
    color: '#2B6E47',
    roughness: 0.65,
  });

  // ==============================================================
  // 1. GROOM (NOAH) — Seated in Left Driver Seat (x = -0.44, z = 0.42)
  // ==============================================================
  const groom = new THREE.Group();
  groom.position.set(-0.44, 0.82, 0.42);

  // Tailored Tuxedo Torso & Shoulders
  const groomTorso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.16, 0.54, 14),
    tuxMat
  );
  groomTorso.scale.set(1.22, 1, 0.82);
  groomTorso.position.set(0, 0.28, 0);
  groomTorso.castShadow = true;
  groom.add(groomTorso);

  const groomShoulders = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.1, 0.28, 8, 12),
    tuxMat
  );
  groomShoulders.rotation.z = Math.PI / 2;
  groomShoulders.position.set(0, 0.5, 0);
  groom.add(groomShoulders);

  // Crisp White Dress Shirt V-Front + Bowtie + Pocket Square
  const shirtFront = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.06), whiteShirtMat);
  shirtFront.position.set(0, 0.43, -0.14);
  groom.add(shirtFront);

  const bowtieLeft = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.028, 0.03), tuxMat);
  bowtieLeft.position.set(-0.025, 0.52, -0.17);
  bowtieLeft.rotation.z = 0.18;
  const bowtieRight = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.028, 0.03), tuxMat);
  bowtieRight.position.set(0.025, 0.52, -0.17);
  bowtieRight.rotation.z = -0.18;
  groom.add(bowtieLeft, bowtieRight);

  const boutonniere = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), bouquetRoseMat);
  boutonniere.position.set(0.09, 0.44, -0.155);
  groom.add(boutonniere);

  // Groom Neck & Head Group (rotates gently into turns!)
  const groomHead = new THREE.Group();
  groomHead.position.set(0, 0.58, -0.02);

  const groomNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.062, 0.11, 10), skinMat);
  groomNeck.position.y = 0.04;
  groomHead.add(groomNeck);

  const gSkull = new THREE.Mesh(new THREE.SphereGeometry(0.145, 18, 16), skinMat);
  gSkull.scale.set(0.92, 1.08, 0.98);
  gSkull.position.y = 0.19;
  gSkull.castShadow = true;
  groomHead.add(gSkull);

  // Styled Swept Groom Hair
  const gHairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.152, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
    groomHairMat
  );
  gHairTop.scale.set(0.96, 1.04, 1.04);
  gHairTop.position.set(0, 0.22, 0.02);
  gHairTop.rotation.x = 0.18;
  groomHead.add(gHairTop);

  const gHairQuiff = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.055, 0.11), groomHairMat);
  gHairQuiff.position.set(0, 0.34, -0.04);
  gHairQuiff.rotation.x = -0.18;
  groomHead.add(gHairQuiff);

  // Miami Aviator Sunglasses
  const gLensL = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.045, 0.024), glassesMat);
  gLensL.position.set(-0.055, 0.21, -0.135);
  const gLensR = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.045, 0.024), glassesMat);
  gLensR.position.set(0.055, 0.21, -0.135);
  const gBridge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.012, 0.02), goldMat);
  gBridge.position.set(0, 0.22, -0.136);
  groomHead.add(gLensL, gLensR, gBridge);

  groom.add(groomHead);

  // Groom Arms Reaching Naturally onto the Steering Wheel
  [-0.21, 0.21].forEach((armX) => {
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.36, 8, 10), tuxMat);
    sleeve.position.set(armX * 0.92, 0.4, -0.25);
    sleeve.rotation.x = Math.PI * 0.42;
    sleeve.rotation.z = armX < 0 ? -0.15 : 0.15;
    groom.add(sleeve);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), skinMat);
    hand.position.set(armX * 0.72, 0.33, -0.46);
    groom.add(hand);
  });

  group.add(groom);

  // ==============================================================
  // 2. BRIDE (AVA) — Seated in Right Passenger Seat (x = +0.44, z = 0.44)
  // ==============================================================
  const bride = new THREE.Group();
  bride.position.set(0.44, 0.8, 0.44);

  // Ivory Silk Wedding Dress Bodice & Draped Skirt in Cockpit
  const brideBodice = new THREE.Mesh(
    new THREE.CylinderGeometry(0.145, 0.19, 0.5, 16),
    dressMat
  );
  brideBodice.scale.set(1.12, 1, 0.84);
  brideBodice.position.set(0, 0.26, 0);
  brideBodice.castShadow = true;
  bride.add(brideBodice);

  // Off-shoulder Satin Gown Trim + Warm Bare Shoulders
  const brideShoulders = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.078, 0.24, 8, 12),
    skinMat
  );
  brideShoulders.rotation.z = Math.PI / 2;
  brideShoulders.position.set(0, 0.49, 0);
  bride.add(brideShoulders);

  const offShoulderBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.175, 0.032, 8, 22),
    dressMat
  );
  offShoulderBand.rotation.x = Math.PI / 2;
  offShoulderBand.scale.set(1.15, 0.76, 1);
  offShoulderBand.position.set(0, 0.44, 0);
  bride.add(offShoulderBand);

  // Bride Neck & Head Group
  const brideHead = new THREE.Group();
  brideHead.position.set(0, 0.55, -0.01);

  const brideNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.052, 0.11, 10), skinMat);
  brideNeck.position.y = 0.04;
  brideHead.add(brideNeck);

  const bSkull = new THREE.Mesh(new THREE.SphereGeometry(0.135, 18, 16), skinMat);
  bSkull.scale.set(0.92, 1.05, 0.96);
  bSkull.position.y = 0.18;
  bSkull.castShadow = true;
  brideHead.add(bSkull);

  // Chestnut Hair Crown + Low Chignon Bun + Side Locks
  const bHairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.145, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62),
    brideHairMat
  );
  bHairCrown.position.set(0, 0.2, 0.018);
  bHairCrown.rotation.x = 0.2;
  brideHead.add(bHairCrown);

  const bHairBun = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), brideHairMat);
  bHairBun.position.set(0, 0.17, 0.14);
  brideHead.add(bHairBun);

  [-0.11, 0.11].forEach((sideX) => {
    const wave = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.18, 8, 10), brideHairMat);
    wave.position.set(sideX, 0.11, 0.04);
    wave.rotation.z = sideX < 0 ? 0.14 : -0.14;
    brideHead.add(wave);
  });

  // Golden Bridal Tiara Crest
  const tiara = new THREE.Mesh(
    new THREE.TorusGeometry(0.115, 0.012, 8, 20, Math.PI),
    goldMat
  );
  tiara.position.set(0, 0.28, -0.03);
  tiara.rotation.x = -0.35;
  brideHead.add(tiara);

  // Chic Cat-Eye Miami Sunglasses
  const bLensL = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.042, 0.022), glassesMat);
  bLensL.position.set(-0.05, 0.195, -0.125);
  bLensL.rotation.z = -0.08;
  const bLensR = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.042, 0.022), glassesMat);
  bLensR.position.set(0.05, 0.195, -0.125);
  bLensR.rotation.z = 0.08;
  brideHead.add(bLensL, bLensR);

  // Flowing 3-Segment Translucent 3D Bridal Veil Streaming in the Wind!
  const brideVeilSegments: THREE.Mesh[] = [];
  for (let s = 0; s < 3; s++) {
    const segW = 0.26 + s * 0.12;
    const segLen = 0.34;
    const veilSeg = new THREE.Mesh(new THREE.PlaneGeometry(segW, segLen, 2, 2), veilMat);
    veilSeg.rotation.x = Math.PI / 2 - 0.18 + s * 0.05;
    veilSeg.position.set(0, 0.22 - s * 0.04, 0.28 + s * 0.3);
    brideHead.add(veilSeg);
    brideVeilSegments.push(veilSeg);
  }

  bride.add(brideHead);

  // Bride Left Arm Resting Gently Near Console + Tropical Sunset Bridal Bouquet
  const brideLeftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, 0.3, 8, 10), skinMat);
  brideLeftArm.position.set(-0.17, 0.38, -0.14);
  brideLeftArm.rotation.x = Math.PI * 0.35;
  brideLeftArm.rotation.z = -0.22;
  bride.add(brideLeftArm);

  // Bride Right Arm Holding Tropical Bouquet (lifts subtly in joy on boost!)
  const brideRightArm = new THREE.Group();
  brideRightArm.position.set(0.18, 0.46, -0.02);

  const rightArmMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, 0.3, 8, 10), skinMat);
  rightArmMesh.position.set(0.03, -0.04, -0.16);
  rightArmMesh.rotation.x = Math.PI * 0.38;
  brideRightArm.add(rightArmMesh);

  // Tiny 3D Sunset Bridal Bouquet
  const bouquet = new THREE.Group();
  bouquet.position.set(0.04, 0.02, -0.34);
  const wrap = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 8), dressMat);
  wrap.rotation.x = Math.PI;
  wrap.position.y = -0.06;
  bouquet.add(wrap);

  const flowerCoords: Array<[number, number, number, THREE.Material]> = [
    [0, 0.03, 0, bouquetRoseMat],
    [-0.045, 0.015, 0.02, bouquetPeachMat],
    [0.045, 0.02, 0.015, whiteShirtMat],
    [0, 0.015, -0.045, bouquetPeachMat],
    [-0.03, 0.01, -0.03, bouquetLeafMat],
    [0.035, 0.01, -0.03, bouquetLeafMat],
  ];
  for (const [fx, fy, fz, fmat] of flowerCoords) {
    const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), fmat);
    blossom.position.set(fx, fy, fz);
    bouquet.add(blossom);
  }
  brideRightArm.add(bouquet);
  bride.add(brideRightArm);

  group.add(bride);

  return {
    group,
    groomHead,
    brideHead,
    brideVeilSegments,
    brideRightArm,
  };
}

export function buildLuxuryConvertible(
  lighting: MiamiTimeLighting,
  plateTitle: string,
  plateDate: string,
  maxAnisotropy: number
): BuiltConvertible {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: lighting.carBody.clone(),
    metalness: 0.68,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.12,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: '#F4F7FA',
    metalness: 0.96,
    roughness: 0.1,
  });

  const leatherMat = new THREE.MeshStandardMaterial({
    color: '#3A1922',
    roughness: 0.78,
    metalness: 0.04,
  });

  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: '#111018',
    roughness: 0.55,
    metalness: 0.25,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: '#141418',
    roughness: 0.88,
    metalness: 0.05,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#1A2436',
    metalness: 0.15,
    roughness: 0.08,
    transparent: true,
    opacity: 0.48,
  });

  const tailLightMaterial = new THREE.MeshStandardMaterial({
    color: '#FF2D6B',
    emissive: '#FF2D6B',
    emissiveIntensity: 3.1,
    roughness: 0.18,
  });

  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: '#FFF5DB',
    emissive: '#FFE5AA',
    emissiveIntensity: lighting.headlightEmissive,
    roughness: 0.15,
  });

  // 1. Lower sculpted chassis
  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.56, 4.68), bodyMaterial);
  lowerBody.position.set(0, 0.64, 0);
  lowerBody.castShadow = true;
  lowerBody.receiveShadow = true;
  bodyGroup.add(lowerBody);

  // 2. Sculpted long front hood
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.22, 1.85), bodyMaterial);
  hood.position.set(0, 0.96, -1.28);
  hood.rotation.x = 0.04;
  hood.castShadow = true;
  bodyGroup.add(hood);

  // 3. Rear deck / trunk lid
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.22, 1.24), bodyMaterial);
  trunk.position.set(0, 0.98, 1.66);
  trunk.castShadow = true;
  bodyGroup.add(trunk);

  // 4. Side doors & flared shoulder rails framing the open cockpit
  [-0.95, 0.95].forEach((sx) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 1.66), bodyMaterial);
    rail.position.set(sx, 0.98, 0.24);
    bodyGroup.add(rail);

    const sideTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 4.25), chromeMat);
    sideTrim.position.set(sx > 0 ? 1.04 : -1.04, 0.68, 0);
    bodyGroup.add(sideTrim);
  });

  // 5. Open-top luxury interior tub, dashboard, twin seats & steering wheel
  const cockpitFloor = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.12, 1.62), darkTrimMat);
  cockpitFloor.position.set(0, 0.54, 0.22);
  bodyGroup.add(cockpitFloor);

  const dashboard = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.34, 0.44), darkTrimMat);
  dashboard.position.set(0, 0.92, -0.35);
  bodyGroup.add(dashboard);

  const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.028, 10, 20), chromeMat);
  steeringWheel.position.set(-0.44, 1.12, -0.1);
  steeringWheel.rotation.x = -0.42;
  bodyGroup.add(steeringWheel);

  // Twin leather seats + low bolsters so Ava & Noah are prominently visible from behind & front
  [-0.44, 0.44].forEach((seatX) => {
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.56, 0.16), leatherMat);
    seatBack.position.set(seatX, 1.02, 0.72);
    seatBack.rotation.x = -0.18;
    bodyGroup.add(seatBack);

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.12), leatherMat);
    headrest.position.set(seatX, 1.36, 0.78);
    bodyGroup.add(headrest);
  });

  // 6. Seated 3D Wedding Couple (Ava & Noah inside the convertible!)
  const couple = buildSeatedWeddingCouple();
  bodyGroup.add(couple.group);

  // 7. Slanted tinted wrap-around windshield + chrome frame
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.56, 0.05), glassMat);
  windshield.position.set(0, 1.24, -0.46);
  windshield.rotation.x = -0.58;
  bodyGroup.add(windshield);

  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.05, 0.06), chromeMat);
  topFrame.position.set(0, 1.47, -0.31);
  bodyGroup.add(topFrame);

  [-0.89, 0.89].forEach((px) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.58, 0.06), chromeMat);
    pillar.position.set(px, 1.24, -0.46);
    pillar.rotation.x = -0.58;
    bodyGroup.add(pillar);
  });

  // 8. Rear spoiler lip + chrome bumpers + twin exhausts
  const rearSpoiler = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.07, 0.22), bodyMaterial);
  rearSpoiler.position.set(0, 1.13, 2.22);
  bodyGroup.add(rearSpoiler);

  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.16, 0.22), chromeMat);
  frontBumper.position.set(0, 0.44, -2.35);
  bodyGroup.add(frontBumper);

  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.16, 0.22), chromeMat);
  rearBumper.position.set(0, 0.44, 2.35);
  bodyGroup.add(rearBumper);

  [-0.62, 0.62].forEach((ex) => {
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.26, 12), chromeMat);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(ex, 0.34, 2.36);
    bodyGroup.add(exhaust);
  });

  // 9. Iconic full-width GTA VI glowing neon taillight bar + wedding license plate
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.16, 0.08), tailLightMaterial);
  tailBar.position.set(0, 0.86, 2.34);
  bodyGroup.add(tailBar);

  const plateTex = createLicensePlateTexture(plateTitle, plateDate, maxAnisotropy);
  const plateMat = new THREE.MeshStandardMaterial({
    map: plateTex,
    roughness: 0.35,
    metalness: 0.15,
  });
  const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.34), plateMat);
  plateMesh.position.set(0, 0.62, 2.355);
  bodyGroup.add(plateMesh);

  // 10. Twin front headlights + forward road light cones
  const headlightBeamMaterial = new THREE.MeshBasicMaterial({
    color: '#FFE9B8',
    transparent: true,
    opacity: lighting.headlightBeamOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  [-0.72, 0.72].forEach((hx) => {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.15, 0.08), headlightMaterial);
    lamp.position.set(hx, 0.78, -2.34);
    bodyGroup.add(lamp);

    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.18, 7.6, 16, 1, true), headlightBeamMaterial);
    beam.rotation.x = Math.PI / 2 - 0.12;
    beam.position.set(hx, 0.44, -6.0);
    bodyGroup.add(beam);
  });

  // 11. Subtle sunset/night underglow + contact shadow
  const underglowMaterial = new THREE.MeshBasicMaterial({
    color: lighting.neonPrimary.clone(),
    transparent: true,
    opacity: lighting.underglowOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const underglow = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 5.1), underglowMaterial);
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.set(0, 0.03, 0);
  root.add(underglow);

  const shadowMat = new THREE.MeshBasicMaterial({
    color: '#040308',
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 4.8), shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0, 0.02, 0);
  root.add(contactShadow);

  // 12. 4 Multi-part Wheels
  const wheels: THREE.Group[] = [];
  const frontWheelPivots: THREE.Group[] = [];
  const wheelCoords: Array<{ x: number; z: number; isFront: boolean }> = [
    { x: -1.04, z: -1.44, isFront: true },
    { x: 1.04, z: -1.44, isFront: true },
    { x: -1.04, z: 1.44, isFront: false },
    { x: 1.04, z: 1.44, isFront: false },
  ];

  const tireGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.32, 20);
  tireGeo.rotateZ(Math.PI / 2);
  const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.34, 16);
  rimGeo.rotateZ(Math.PI / 2);
  const spokeGeo = new THREE.BoxGeometry(0.36, 0.4, 0.055);

  for (const wc of wheelCoords) {
    const pivot = new THREE.Group();
    pivot.position.set(wc.x, 0.39, wc.z);

    const wheelSpin = new THREE.Group();
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    wheelSpin.add(tire);

    const rim = new THREE.Mesh(rimGeo, chromeMat);
    wheelSpin.add(rim);

    const spoke1 = new THREE.Mesh(spokeGeo, chromeMat);
    const spoke2 = new THREE.Mesh(spokeGeo, chromeMat);
    spoke2.rotation.x = Math.PI / 2;
    wheelSpin.add(spoke1, spoke2);

    pivot.add(wheelSpin);
    root.add(pivot);

    wheels.push(wheelSpin);
    if (wc.isFront) frontWheelPivots.push(pivot);
  }

  return {
    root,
    bodyGroup,
    couple,
    wheels,
    frontWheelPivots,
    bodyMaterial,
    tailLightMaterial,
    headlightMaterial,
    headlightBeamMaterial,
    underglowMaterial,
  };
}

export function buildWaypointGates(lighting: MiamiTimeLighting): BuiltWaypointGate[] {
  const lanes = [-3.2, 0, 3.2, -3.2];
  const gates: BuiltWaypointGate[] = [];

  for (let i = 0; i < 4; i++) {
    const group = new THREE.Group();

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: '#F5CE7A',
      emissive: lighting.neonPrimary.clone(),
      emissiveIntensity: 1.3,
      metalness: 0.85,
      roughness: 0.16,
    });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.08, 12, 32), ringMaterial);
    outerRing.position.y = 1.75;
    group.add(outerRing);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.035, 8, 28),
      ringMaterial
    );
    innerRing.position.y = 1.75;
    group.add(innerRing);

    const beaconMaterial = new THREE.MeshBasicMaterial({
      color: lighting.neonSecondary.clone(),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.85, 9, 12, 1, true),
      beaconMaterial
    );
    beacon.position.y = 4.5;
    group.add(beacon);

    const laneX = lanes[i];
    group.position.set(laneX, 0, -42 - i * 48);

    gates.push({
      group,
      outerRing,
      innerRing,
      beacon,
      ringMaterial,
      beaconMaterial,
      laneX,
      eventIndex: i,
      collectedThisPass: false,
    });
  }

  return gates;
}

export function buildSparkBurst(): BuiltSparkBurst {
  const count = 42;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: '#FFE08A',
    size: 0.22,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, material);
  points.visible = false;

  return {
    points,
    velocities,
    life: 0,
    active: false,
    material,
  };
}

export function triggerSparkBurst(
  burst: BuiltSparkBurst,
  originX: number,
  originY: number,
  originZ: number
) {
  const posAttr = burst.points.geometry.getAttribute('position') as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;
  const count = arr.length / 3;

  for (let i = 0; i < count; i++) {
    arr[i * 3] = originX + (Math.random() - 0.5) * 0.6;
    arr[i * 3 + 1] = originY + (Math.random() - 0.5) * 0.5;
    arr[i * 3 + 2] = originZ + (Math.random() - 0.5) * 0.4;

    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 5.2;
    burst.velocities[i * 3] = Math.cos(angle) * speed;
    burst.velocities[i * 3 + 1] = 2.0 + Math.random() * 4.5;
    burst.velocities[i * 3 + 2] = Math.sin(angle) * speed - 2.0;
  }

  posAttr.needsUpdate = true;
  burst.life = 1.0;
  burst.active = true;
  burst.points.visible = true;
  burst.material.opacity = 1;
}
