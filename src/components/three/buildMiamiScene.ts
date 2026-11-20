import * as THREE from 'three';
import type { ViceThemeId } from '../../types/theme';

export interface MiamiThemePalette {
  skyTop: THREE.Color;
  skyMid: THREE.Color;
  skyHorizon: THREE.Color;
  fogColor: THREE.Color;
  sunCore: THREE.Color;
  sunGlow: THREE.Color;
  oceanColor: THREE.Color;
  neonPrimary: THREE.Color;
  neonSecondary: THREE.Color;
  keyLight: THREE.Color;
  fillLight: THREE.Color;
  carBody: THREE.Color;
}

export const MIAMI_3D_PALETTES: Record<ViceThemeId, MiamiThemePalette> = {
  vice: {
    skyTop: new THREE.Color('#0E0A1F'),
    skyMid: new THREE.Color('#471949'),
    skyHorizon: new THREE.Color('#F26B7A'),
    fogColor: new THREE.Color('#2A1230'),
    sunCore: new THREE.Color('#FFE69C'),
    sunGlow: new THREE.Color('#FF6A7D'),
    oceanColor: new THREE.Color('#0C1829'),
    neonPrimary: new THREE.Color('#FF5A8A'),
    neonSecondary: new THREE.Color('#5CE1E6'),
    keyLight: new THREE.Color('#FFB17A'),
    fillLight: new THREE.Color('#7AC8DB'),
    carBody: new THREE.Color('#F0D4C8'),
  },
  golden: {
    skyTop: new THREE.Color('#140D0C'),
    skyMid: new THREE.Color('#5A281E'),
    skyHorizon: new THREE.Color('#F3B463'),
    fogColor: new THREE.Color('#2B1611'),
    sunCore: new THREE.Color('#FFF2C2'),
    sunGlow: new THREE.Color('#F29E4C'),
    oceanColor: new THREE.Color('#101B21'),
    neonPrimary: new THREE.Color('#F5C86B'),
    neonSecondary: new THREE.Color('#6BC5B8'),
    keyLight: new THREE.Color('#FFD28A'),
    fillLight: new THREE.Color('#7EC9BE'),
    carBody: new THREE.Color('#F5E3C3'),
  },
  midnight: {
    skyTop: new THREE.Color('#050814'),
    skyMid: new THREE.Color('#1A1A4A'),
    skyHorizon: new THREE.Color('#6B5CE7'),
    fogColor: new THREE.Color('#11122E'),
    sunCore: new THREE.Color('#B5F0FF'),
    sunGlow: new THREE.Color('#B584FF'),
    oceanColor: new THREE.Color('#071022'),
    neonPrimary: new THREE.Color('#6DD5ED'),
    neonSecondary: new THREE.Color('#F072A5'),
    keyLight: new THREE.Color('#9ED8FF'),
    fillLight: new THREE.Color('#C78BFF'),
    carBody: new THREE.Color('#DCE8F7'),
  },
};

export interface BuiltConvertible {
  root: THREE.Group;
  bodyGroup: THREE.Group;
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

  // Rich wet-asphalt base
  ctx.fillStyle = '#191922';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle aggregate asphalt speckle & longitudinal tire sheen
  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = 20 + Math.floor(Math.random() * 24);
    ctx.fillStyle = `rgb(${shade},${shade},${shade + 6})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Subtle dark lane wear tracks
  const tracks = [110, 162, 232, 280, 350, 402];
  ctx.fillStyle = 'rgba(8, 8, 14, 0.28)';
  for (const tx of tracks) {
    ctx.fillRect(tx - 10, 0, 20, 512);
  }

  // Crisp outer white highway borders
  ctx.fillStyle = '#E8DFD5';
  ctx.fillRect(24, 0, 8, 512);
  ctx.fillRect(480, 0, 8, 512);

  // Dashed lane dividers for 3 lanes (x = 176 and x = 336)
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

export function createSkyBackdrop(palette: MiamiThemePalette): {
  skyMesh: THREE.Mesh;
  skyMaterial: THREE.ShaderMaterial;
  sunGroup: THREE.Group;
  sunCoreMat: THREE.MeshBasicMaterial;
  sunHaloMat: THREE.MeshBasicMaterial;
} {
  const skyGeo = new THREE.SphereGeometry(180, 32, 20);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTop: { value: palette.skyTop.clone() },
      uMid: { value: palette.skyMid.clone() },
      uHorizon: { value: palette.skyHorizon.clone() },
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

  // Iconic layered Miami Sunset Sun over the horizon
  const sunGroup = new THREE.Group();
  sunGroup.position.set(0, 16, -132);

  const sunCoreMat = new THREE.MeshBasicMaterial({
    color: palette.sunCore.clone(),
    fog: false,
  });
  const sunCore = new THREE.Mesh(new THREE.CircleGeometry(18, 48), sunCoreMat);
  sunGroup.add(sunCore);

  const sunHaloMat = new THREE.MeshBasicMaterial({
    color: palette.sunGlow.clone(),
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  const sunHalo = new THREE.Mesh(new THREE.CircleGeometry(31, 48), sunHaloMat);
  sunHalo.position.z = -0.4;
  sunGroup.add(sunHalo);

  // Subtle GTA sunset horizontal atmospheric bands across the lower sun
  const bandMat = new THREE.MeshBasicMaterial({
    color: palette.skyHorizon.clone(),
    transparent: true,
    opacity: 0.65,
    fog: false,
  });
  const bandOffsets = [-11.5, -8.2, -5.2, -2.6];
  const bandHeights = [1.45, 1.05, 0.72, 0.44];
  bandOffsets.forEach((by, idx) => {
    const band = new THREE.Mesh(new THREE.PlaneGeometry(38, bandHeights[idx]), bandMat);
    band.position.set(0, by, 0.15);
    sunGroup.add(band);
  });

  return { skyMesh, skyMaterial, sunGroup, sunCoreMat, sunHaloMat };
}

export function buildMiamiSkyline(palette: MiamiThemePalette): {
  group: THREE.Group;
  windowMaterials: THREE.MeshBasicMaterial[];
} {
  const group = new THREE.Group();
  const buildingMat = new THREE.MeshStandardMaterial({
    color: '#110E1C',
    roughness: 0.85,
    metalness: 0.15,
  });
  const windowPrimary = new THREE.MeshBasicMaterial({
    color: palette.neonPrimary.clone(),
    fog: true,
  });
  const windowSecondary = new THREE.MeshBasicMaterial({
    color: palette.neonSecondary.clone(),
    fog: true,
  });

  // Left and right distant Miami Beach skyline silhouettes (leaving center sunset road open)
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

    // Subtle Art-Deco neon roofline accent
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(b.w + 0.15, 0.42, 0.3),
      i % 2 === 0 ? windowPrimary : windowSecondary
    );
    strip.position.set(b.x, b.h - 1.1, -118 + b.d / 2 + 0.12);
    group.add(strip);
  });

  return { group, windowMaterials: [windowPrimary, windowSecondary] };
}

export function buildCausewayEnvironment(
  palette: MiamiThemePalette,
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

  // Raised concrete Ocean Drive sidewalks & glowing art-deco curb strips
  const curbMat = new THREE.MeshStandardMaterial({
    color: '#2A2535',
    roughness: 0.78,
    metalness: 0.08,
  });
  const curbNeonMaterial = new THREE.MeshStandardMaterial({
    color: palette.neonPrimary.clone(),
    emissive: palette.neonPrimary.clone(),
    emissiveIntensity: 1.4,
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

  // Expansive Atlantic & Biscayne Bay water planes flanking the causeway
  const oceanMaterial = new THREE.MeshStandardMaterial({
    color: palette.oceanColor.clone(),
    roughness: 0.18,
    metalness: 0.72,
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

  // 4-segment subtly curved trunk
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

  // Crown & 7 arched tropical fronds
  const fronds = new THREE.Group();
  fronds.position.set(currentX, currentY, 0);

  const frondCount = 7;
  for (let f = 0; f < frondCount; f++) {
    const angle = (f / frondCount) * Math.PI * 2 + (leanSign > 0 ? 0.3 : -0.3);
    const frondPivot = new THREE.Group();
    frondPivot.rotation.y = angle;

    // Two-piece arched palm leaf for realistic tropical silhouette
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

export function buildPalmRow(): BuiltPalmRow {
  const palms: THREE.Group[] = [];
  const frondGroups: THREE.Group[] = [];
  const spacing = 14;
  const countPerSide = 9;

  const trunkMat = new THREE.MeshStandardMaterial({
    color: '#3A2822',
    roughness: 0.92,
    metalness: 0.02,
  });
  const frondMat = new THREE.MeshStandardMaterial({
    color: '#133128',
    roughness: 0.72,
    metalness: 0.06,
  });

  for (let i = 0; i < countPerSide; i++) {
    const z = 14 - i * spacing;
    // Left side palm leaning slightly toward road
    const left = createSinglePalmTree(trunkMat, frondMat, -1);
    left.palm.position.set(-7.1, 0.25, z);
    left.palm.scale.setScalar(0.92 + (i % 3) * 0.08);
    palms.push(left.palm);
    frondGroups.push(left.fronds);

    // Right side palm leaning slightly toward road
    const right = createSinglePalmTree(trunkMat, frondMat, 1);
    right.palm.position.set(7.1, 0.25, z - spacing * 0.45);
    right.palm.scale.setScalar(0.95 + ((i + 1) % 3) * 0.07);
    palms.push(right.palm);
    frondGroups.push(right.fronds);
  }

  return { palms, frondGroups, spacing, countPerSide };
}

export function buildArtDecoLamps(palette: MiamiThemePalette): BuiltLampRow {
  const lamps: THREE.Group[] = [];
  const spacing = 22;
  const countPerSide = 6;

  const poleMat = new THREE.MeshStandardMaterial({
    color: '#C7CFD9',
    metalness: 0.88,
    roughness: 0.24,
  });
  const warmBulb = new THREE.MeshStandardMaterial({
    color: palette.neonSecondary.clone(),
    emissive: palette.neonSecondary.clone(),
    emissiveIntensity: 2.2,
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

export function buildLuxuryConvertible(
  palette: MiamiThemePalette,
  plateTitle: string,
  plateDate: string,
  maxAnisotropy: number
): BuiltConvertible {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Clearcoat vintage Miami champagne-pearl paint
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: palette.carBody.clone(),
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
    opacity: 0.58,
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
    emissiveIntensity: 2.8,
    roughness: 0.15,
  });

  // 1. Lower sculpted chassis (wide luxury grand tourer stance)
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

    // Chrome side molding strip
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
  steeringWheel.position.set(-0.44, 1.08, -0.14);
  steeringWheel.rotation.x = -0.45;
  bodyGroup.add(steeringWheel);

  // Twin leather seats + sculpted headrests (Ava & Noah cruising together!)
  [-0.44, 0.44].forEach((seatX) => {
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.66, 0.18), leatherMat);
    seatBack.position.set(seatX, 1.04, 0.68);
    seatBack.rotation.x = -0.18;
    bodyGroup.add(seatBack);

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.14), leatherMat);
    headrest.position.set(seatX, 1.44, 0.74);
    bodyGroup.add(headrest);
  });

  // 6. Slanted tinted wrap-around windshield + chrome frame
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

  // 7. Rear spoiler lip + chrome bumpers + twin exhausts
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

  // 8. Iconic full-width GTA VI glowing neon taillight bar
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.16, 0.08), tailLightMaterial);
  tailBar.position.set(0, 0.86, 2.34);
  bodyGroup.add(tailBar);

  // Rear personalized wedding license plate ("AVA & NOAH / JUNE 19 2027")
  const plateTex = createLicensePlateTexture(plateTitle, plateDate, maxAnisotropy);
  const plateMat = new THREE.MeshStandardMaterial({
    map: plateTex,
    roughness: 0.35,
    metalness: 0.15,
  });
  const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.34), plateMat);
  plateMesh.position.set(0, 0.62, 2.355);
  bodyGroup.add(plateMesh);

  // 9. Twin front headlights + soft forward road projection cones
  const headlightBeamMaterial = new THREE.MeshBasicMaterial({
    color: '#FFE9B8',
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  [-0.72, 0.72].forEach((hx) => {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.15, 0.08), headlightMaterial);
    lamp.position.set(hx, 0.78, -2.34);
    bodyGroup.add(lamp);

    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.15, 7.2, 16, 1, true), headlightBeamMaterial);
    beam.rotation.x = Math.PI / 2 - 0.12;
    beam.position.set(hx, 0.44, -5.85);
    bodyGroup.add(beam);
  });

  // 10. Subtle sunset underglow + contact grounding shadow
  const underglowMaterial = new THREE.MeshBasicMaterial({
    color: palette.neonPrimary.clone(),
    transparent: true,
    opacity: 0.24,
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
    opacity: 0.65,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 4.8), shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0, 0.02, 0);
  root.add(contactShadow);

  // 11. 4 Multi-part Wheels (Rubber tire + Deep-dish chrome rim + 5 spokes)
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

    // Cross spokes so rotation is clearly visible at highway speed
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
    wheels,
    frontWheelPivots,
    bodyMaterial,
    tailLightMaterial,
    headlightMaterial,
    headlightBeamMaterial,
    underglowMaterial,
  };
}

export function buildWaypointGates(palette: MiamiThemePalette): BuiltWaypointGate[] {
  const lanes = [-3.2, 0, 3.2, -3.2];
  const gates: BuiltWaypointGate[] = [];

  for (let i = 0; i < 4; i++) {
    const group = new THREE.Group();

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: '#F5CE7A',
      emissive: palette.neonPrimary.clone(),
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
      color: palette.neonSecondary.clone(),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.85, 9, 12, 1, true), beaconMaterial);
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

export function triggerSparkBurst(burst: BuiltSparkBurst, originX: number, originY: number, originZ: number) {
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
