import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  Flame,
  Gauge,
} from 'lucide-react';
import type { ViceThemeId } from '../types/theme';
import type { WeddingConfig } from '../types/wedding';
import { EDITORIAL_IMAGES } from '../data/weddingDefaults';
import {
  MIAMI_3D_PALETTES,
  buildArtDecoLamps,
  buildCausewayEnvironment,
  buildLuxuryConvertible,
  buildMiamiSkyline,
  buildPalmRow,
  buildSparkBurst,
  buildWaypointGates,
  createSkyBackdrop,
  triggerSparkBurst,
} from './three/buildMiamiScene';

interface ViceCruise3DSectionProps {
  config: WeddingConfig;
  theme: ViceThemeId;
}

type CameraMode = 'chase' | 'orbit' | 'front';

const CAMERA_LABELS: Record<CameraMode, string> = {
  chase: 'Chase Cam',
  orbit: 'Cinema Orbit',
  front: 'Poster Front',
};

const CAMERA_ORDER: CameraMode[] = ['chase', 'orbit', 'front'];
const LANE_POSITIONS = [-3.2, 0, 3.2];

function detectSoftwareWebGL(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    const rendererStr = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
    return /swiftshader|llvmpipe|softpipe|mesa offscreen/i.test(rendererStr);
  } catch {
    return false;
  }
}

export function ViceCruise3DSection({ config, theme }: ViceCruise3DSectionProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<ViceThemeId>(theme);
  themeRef.current = theme;

  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const cameraModeRef = useRef<CameraMode>('chase');
  cameraModeRef.current = cameraMode;

  const [turboActive, setTurboActive] = useState(false);
  const turboRef = useRef(false);
  turboRef.current = turboActive;

  const [hudHidden, setHudHidden] = useState(false);
  const [speedMph, setSpeedMph] = useState(68);
  const [unlockedIndices, setUnlockedIndices] = useState<number[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number>(0);
  const [unlockBanner, setUnlockBanner] = useState<{
    index: number;
    title: string;
    time: string;
    venue: string;
  } | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  // Interactive steering state refs (zero React re-renders per animation frame)
  const targetLaneXRef = useRef(0);
  const steerHoldRef = useRef<-1 | 0 | 1>(0);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragBaseLaneXRef = useRef(0);
  const bannerTimeoutRef = useRef<number | null>(null);

  const waypoints = useMemo(() => {
    const items = config.schedule.slice(0, 4);
    if (items.length > 0) return items;
    return [
      {
        id: 'ceremony',
        title: 'Sunset Ceremony',
        subtitle: config.displayDate,
        time: '4:30 PM',
        endTime: '5:30 PM',
        location: config.venueName,
        description: 'Vows overlooking the Atlantic.',
        dressHint: config.dressCode,
        icon: 'ceremony' as const,
      },
    ];
  }, [config.displayDate, config.dressCode, config.schedule, config.venueName]);

  const waypointsRef = useRef(waypoints);
  waypointsRef.current = waypoints;

  const handleUnlockWaypoint = useCallback((idx: number) => {
    const safeIdx = idx % waypointsRef.current.length;
    const item = waypointsRef.current[safeIdx];
    if (!item) return;

    setUnlockedIndices((prev) => (prev.includes(safeIdx) ? prev : [...prev, safeIdx]));
    setSelectedCheckpoint(safeIdx);
    setUnlockBanner({
      index: safeIdx,
      title: item.title,
      time: item.time,
      venue: item.location,
    });

    if (bannerTimeoutRef.current !== null) {
      window.clearTimeout(bannerTimeoutRef.current);
    }
    bannerTimeoutRef.current = window.setTimeout(() => {
      setUnlockBanner(null);
    }, 3000);
  }, []);

  const stepLane = useCallback((dir: -1 | 1) => {
    const curr = targetLaneXRef.current;
    let nearestIdx = 1;
    let bestDist = Infinity;
    LANE_POSITIONS.forEach((lx, i) => {
      const d = Math.abs(curr - lx);
      if (d < bestDist) {
        bestDist = d;
        nearestIdx = i;
      }
    });
    const nextIdx = Math.max(0, Math.min(LANE_POSITIONS.length - 1, nearestIdx + dir));
    targetLaneXRef.current = LANE_POSITIONS[nextIdx];
  }, []);

  const cycleCamera = () => {
    setCameraMode((curr) => {
      const idx = CAMERA_ORDER.indexOf(curr);
      return CAMERA_ORDER[(idx + 1) % CAMERA_ORDER.length];
    });
  };

  // Mount Three.js 3D Ocean Drive Cruise World
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;

    try {
      // Initial probe to detect software WebGL cleanly before final renderer config
      const probeCanvas = document.createElement('canvas');
      const probeGl =
        probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!probeGl) {
        setWebglUnavailable(true);
        return;
      }
      const isSoftwareGl = detectSoftwareWebGL(probeGl);

      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: isSoftwareGl ? 'default' : 'high-performance',
        alpha: false,
      });

      const initialWidth = Math.max(container.clientWidth, 320);
      const initialHeight = Math.max(container.clientHeight, 360);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
      renderer.setSize(initialWidth, initialHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !isSoftwareGl;
      if (!isSoftwareGl) {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      container.innerHTML = '';
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.touchAction = 'pan-y';
      container.appendChild(renderer.domElement);

      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
      const palette = MIAMI_3D_PALETTES[themeRef.current];

      // Scene & PMREM RoomEnvironment for crisp automotive clearcoat & chrome reflections
      const scene = new THREE.Scene();
      const fog = new THREE.FogExp2(palette.fogColor.getHex(), 0.011);
      scene.fog = fog;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envTarget.texture;
      scene.environmentIntensity = 0.78;

      // Camera
      const camera = new THREE.PerspectiveCamera(56, initialWidth / initialHeight, 0.1, 260);
      camera.position.set(0, 3.3, 8.2);

      // 3-Point Warm Sunset + Cool Ocean Lighting Rig
      const hemiLight = new THREE.HemisphereLight(
        palette.keyLight.getHex(),
        palette.oceanColor.getHex(),
        0.9
      );
      scene.add(hemiLight);

      const sunKeyLight = new THREE.DirectionalLight(palette.keyLight.getHex(), 2.35);
      sunKeyLight.position.set(4, 14, -26);
      if (!isSoftwareGl) {
        sunKeyLight.castShadow = true;
        sunKeyLight.shadow.mapSize.set(1024, 1024);
        sunKeyLight.shadow.camera.near = 2;
        sunKeyLight.shadow.camera.far = 65;
        sunKeyLight.shadow.camera.left = -12;
        sunKeyLight.shadow.camera.right = 12;
        sunKeyLight.shadow.camera.top = 12;
        sunKeyLight.shadow.camera.bottom = -12;
        sunKeyLight.shadow.bias = -0.0005;
      }
      scene.add(sunKeyLight);

      const rimFillLight = new THREE.DirectionalLight(palette.fillLight.getHex(), 1.15);
      rimFillLight.position.set(-12, 6, 12);
      scene.add(rimFillLight);

      // World Assembly
      const sky = createSkyBackdrop(palette);
      scene.add(sky.skyMesh, sky.sunGroup);

      const skyline = buildMiamiSkyline(palette);
      scene.add(skyline.group);

      const causeway = buildCausewayEnvironment(palette, maxAnisotropy);
      scene.add(causeway.group);

      const palmRow = buildPalmRow();
      palmRow.palms.forEach((p) => scene.add(p));

      const lampRow = buildArtDecoLamps(palette);
      lampRow.lamps.forEach((l) => scene.add(l));

      const plateTitle = `${config.brideFirstName} & ${config.groomFirstName}`;
      const plateDate = config.displayDate.replace(/^[^,]+,\s*/, '');
      const car = buildLuxuryConvertible(palette, plateTitle, plateDate, maxAnisotropy);
      scene.add(car.root);

      const gates = buildWaypointGates(palette);
      gates.forEach((g) => scene.add(g.group));

      const sparks = buildSparkBurst();
      scene.add(sparks.points);

      // WebGL context loss resilience
      let contextLost = false;
      const onContextLost = (e: Event) => {
        e.preventDefault();
        contextLost = true;
      };
      const onContextRestored = () => {
        contextLost = false;
      };
      renderer.domElement.addEventListener('webglcontextlost', onContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

      // Resize observer for crisp portrait mobile & widescreen desktop framing
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const w = Math.max(Math.floor(entry.contentRect.width), 280);
        const h = Math.max(Math.floor(entry.contentRect.height), 320);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      });
      resizeObserver.observe(container);

      // Software WebGL GPU fence pacing helper (follows threejs/SKILL.md)
      const glCtx = renderer.getContext();
      let fenceTimerId: number | null = null;
      const afterDraw = (next: () => void) => {
        if (!isSoftwareGl) {
          rafId = window.requestAnimationFrame(next);
          return;
        }
        if (typeof WebGL2RenderingContext !== 'undefined' && glCtx instanceof WebGL2RenderingContext) {
          const sync = glCtx.fenceSync(glCtx.SYNC_GPU_COMMANDS_COMPLETE, 0);
          glCtx.flush();
          const poll = () => {
            if (!running) {
              if (sync) glCtx.deleteSync(sync);
              return;
            }
            if (!sync || glCtx.clientWaitSync(sync, 0, 0) !== glCtx.TIMEOUT_EXPIRED) {
              if (sync) glCtx.deleteSync(sync);
              fenceTimerId = window.setTimeout(next, 80);
            } else {
              fenceTimerId = window.setTimeout(poll, 16);
            }
          };
          poll();
        } else {
          glCtx.finish();
          fenceTimerId = window.setTimeout(next, 80);
        }
      };

      // Pre-allocated animation state & vectors (zero GC in loop)
      const desiredCamPos = new THREE.Vector3();
      const desiredLookAt = new THREE.Vector3();
      const currentLookAt = new THREE.Vector3(0, 1.2, -12);
      let carX = 0;
      let prevCarX = 0;
      let currentSpeed = 24;
      let elapsed = 0;
      let lastTime = performance.now();
      let lastHudUpdate = 0;
      let running = true;
      let rafId = 0;

      const palmWrapSpan = palmRow.spacing * palmRow.countPerSide;
      const lampWrapSpan = lampRow.spacing * lampRow.countPerSide;
      const gateWrapSpan = 48 * gates.length;

      const tick = () => {
        if (!running) return;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        if (!contextLost) {
          const motionScale = prefersReducedMotion ? 0.15 : 1;
          elapsed += dt * motionScale;

          // Smooth live 3D theme palette transitions
          const targetPalette = MIAMI_3D_PALETTES[themeRef.current];
          const colorLerp = Math.min(1, dt * 4.5);
          sky.skyMaterial.uniforms.uTop.value.lerp(targetPalette.skyTop, colorLerp);
          sky.skyMaterial.uniforms.uMid.value.lerp(targetPalette.skyMid, colorLerp);
          sky.skyMaterial.uniforms.uHorizon.value.lerp(targetPalette.skyHorizon, colorLerp);
          fog.color.lerp(targetPalette.fogColor, colorLerp);
          sky.sunCoreMat.color.lerp(targetPalette.sunCore, colorLerp);
          sky.sunHaloMat.color.lerp(targetPalette.sunGlow, colorLerp);
          causeway.oceanMaterial.color.lerp(targetPalette.oceanColor, colorLerp);
          causeway.curbNeonMaterial.color.lerp(targetPalette.neonPrimary, colorLerp);
          causeway.curbNeonMaterial.emissive.lerp(targetPalette.neonPrimary, colorLerp);
          sunKeyLight.color.lerp(targetPalette.keyLight, colorLerp);
          rimFillLight.color.lerp(targetPalette.fillLight, colorLerp);
          car.bodyMaterial.color.lerp(targetPalette.carBody, colorLerp);
          car.underglowMaterial.color.lerp(targetPalette.neonPrimary, colorLerp);
          skyline.windowMaterials[0].color.lerp(targetPalette.neonPrimary, colorLerp);
          skyline.windowMaterials[1].color.lerp(targetPalette.neonSecondary, colorLerp);
          lampRow.bulbMaterials[0].color.lerp(targetPalette.neonSecondary, colorLerp);
          lampRow.bulbMaterials[0].emissive.lerp(targetPalette.neonSecondary, colorLerp);

          // Steering input (held buttons or drag/lane target)
          if (steerHoldRef.current !== 0) {
            targetLaneXRef.current = THREE.MathUtils.clamp(
              targetLaneXRef.current + steerHoldRef.current * 7.2 * dt,
              -3.55,
              3.55
            );
          }

          prevCarX = carX;
          carX = THREE.MathUtils.damp(carX, targetLaneXRef.current, 6.5, dt);
          const lateralVel = dt > 0.0001 ? (carX - prevCarX) / dt : 0;

          // Cruise vs Turbo Boost dynamics
          const isTurbo = turboRef.current;
          const targetSpeed = isTurbo ? 46 : 24;
          currentSpeed = THREE.MathUtils.damp(currentSpeed, targetSpeed, 3.8, dt);
          const travel = currentSpeed * dt * motionScale;

          // Update car transform, subtle suspension bounce, body roll & wheel turn
          car.root.position.x = carX;
          car.bodyGroup.position.y = Math.sin(elapsed * 9.5) * 0.018;
          car.bodyGroup.rotation.z = THREE.MathUtils.damp(
            car.bodyGroup.rotation.z,
            -lateralVel * 0.022,
            8,
            dt
          );
          car.root.rotation.y = THREE.MathUtils.damp(
            car.root.rotation.y,
            -lateralVel * 0.035,
            8,
            dt
          );
          car.tailLightMaterial.emissiveIntensity = isTurbo ? 4.8 : 3.0;
          car.headlightBeamMaterial.opacity = isTurbo ? 0.2 : 0.12;

          for (const w of car.wheels) {
            w.rotation.x -= travel * 2.4;
          }
          for (const pivot of car.frontWheelPivots) {
            pivot.rotation.y = THREE.MathUtils.damp(
              pivot.rotation.y,
              -lateralVel * 0.065,
              10,
              dt
            );
          }

          // Scroll highway asphalt texture
          causeway.roadTexture.offset.y += travel * 0.082;

          // Scroll palm trees with gentle tropical sea breeze sway
          for (let i = 0; i < palmRow.palms.length; i++) {
            const p = palmRow.palms[i];
            p.position.z += travel;
            if (p.position.z > 20) {
              p.position.z -= palmWrapSpan;
            }
            palmRow.frondGroups[i].rotation.z = Math.sin(elapsed * 1.8 + i * 0.9) * 0.045;
          }

          // Scroll art-deco street lamps
          for (let i = 0; i < lampRow.lamps.length; i++) {
            const l = lampRow.lamps[i];
            l.position.z += travel;
            if (l.position.z > 18) {
              l.position.z -= lampWrapSpan;
            }
          }

          // Scroll interactive glowing 3D wedding waypoint gates & check collision
          for (let i = 0; i < gates.length; i++) {
            const gate = gates[i];
            gate.group.position.z += travel;
            gate.outerRing.rotation.z += dt * 1.15 * motionScale;
            gate.innerRing.rotation.z -= dt * 1.75 * motionScale;
            gate.ringMaterial.emissive.lerp(targetPalette.neonPrimary, colorLerp);
            gate.beaconMaterial.color.lerp(targetPalette.neonSecondary, colorLerp);

            // Hit detection as car passes through the glowing golden ring
            if (
              !gate.collectedThisPass &&
              gate.group.position.z > -1.7 &&
              gate.group.position.z < 1.9 &&
              Math.abs(carX - gate.laneX) < 1.95
            ) {
              gate.collectedThisPass = true;
              triggerSparkBurst(sparks, carX, 1.5, 0);
              handleUnlockWaypoint(gate.eventIndex);
            }

            if (gate.group.position.z > 16) {
              gate.group.position.z -= gateWrapSpan;
              gate.collectedThisPass = false;
              const nextLane =
                LANE_POSITIONS[(gate.eventIndex + Math.floor(elapsed * 0.25)) % LANE_POSITIONS.length];
              gate.laneX = nextLane;
              gate.group.position.x = nextLane;
            }
          }

          // Update 3D spark burst particles on waypoint collection
          if (sparks.active) {
            sparks.life -= dt * 1.45;
            if (sparks.life <= 0) {
              sparks.active = false;
              sparks.points.visible = false;
            } else {
              const posAttr = sparks.points.geometry.getAttribute('position') as THREE.BufferAttribute;
              const arr = posAttr.array as Float32Array;
              for (let i = 0; i < arr.length / 3; i++) {
                arr[i * 3] += sparks.velocities[i * 3] * dt;
                arr[i * 3 + 1] += sparks.velocities[i * 3 + 1] * dt;
                arr[i * 3 + 2] += sparks.velocities[i * 3 + 2] * dt;
                sparks.velocities[i * 3 + 1] -= 9.5 * dt;
              }
              posAttr.needsUpdate = true;
              sparks.material.opacity = Math.max(0, sparks.life);
            }
          }

          // Dynamic GTA Camera Presets (Mobile aspect-aware framing)
          const isPortrait = camera.aspect < 1;
          const mode = cameraModeRef.current;
          const targetFov = mode === 'chase' ? (isTurbo ? 68 : 58) : 52;
          if (Math.abs(camera.fov - targetFov) > 0.05) {
            camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4.5, dt);
            camera.updateProjectionMatrix();
          }

          if (mode === 'chase') {
            desiredCamPos.set(
              carX * 0.62,
              isPortrait ? 3.55 : 2.95,
              isPortrait ? 9.4 : 7.8
            );
            desiredLookAt.set(carX * 0.42, 1.35, -18);
          } else if (mode === 'orbit') {
            const orbitAngle = Math.sin(elapsed * 0.42) * 0.95;
            const radius = isPortrait ? 9.2 : 7.6;
            desiredCamPos.set(
              carX + Math.sin(orbitAngle) * radius,
              2.5 + Math.cos(elapsed * 0.6) * 0.35,
              Math.cos(orbitAngle) * radius
            );
            desiredLookAt.set(carX, 1.05, -2.5);
          } else {
            // Front 3/4 Movie Poster Hero Angle
            desiredCamPos.set(
              carX + (isPortrait ? 3.1 : 3.8),
              1.9,
              isPortrait ? -7.2 : -6.2
            );
            desiredLookAt.set(carX, 0.95, 1.2);
          }

          camera.position.lerp(desiredCamPos, Math.min(1, dt * 4.8));
          currentLookAt.lerp(desiredLookAt, Math.min(1, dt * 6.0));
          camera.lookAt(currentLookAt);

          renderer.render(scene, camera);

          // Throttled MPH HUD readout (~8x/sec for clean zero-jank UI)
          if (now - lastHudUpdate > 125) {
            lastHudUpdate = now;
            const mph = Math.round(currentSpeed * 2.78 + Math.sin(elapsed * 3.1) * 1.4);
            setSpeedMph(mph);
          }
        }

        afterDraw(tick);
      };

      // Kick off first frame
      tick();

      // Keyboard steering support for desktop players
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          steerHoldRef.current = -1;
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          steerHoldRef.current = 1;
        } else if (e.key === 'Shift') {
          setTurboActive(true);
        }
      };
      const onKeyUp = (e: KeyboardEvent) => {
        if (
          e.key === 'ArrowLeft' ||
          e.key === 'a' ||
          e.key === 'A' ||
          e.key === 'ArrowRight' ||
          e.key === 'd' ||
          e.key === 'D'
        ) {
          steerHoldRef.current = 0;
        } else if (e.key === 'Shift') {
          setTurboActive(false);
        }
      };
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);

      return () => {
        running = false;
        window.cancelAnimationFrame(rafId);
        if (fenceTimerId !== null) window.clearTimeout(fenceTimerId);
        if (bannerTimeoutRef.current !== null) window.clearTimeout(bannerTimeoutRef.current);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

        // Full GPU resource disposal
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
            obj.geometry?.dispose();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => {
              if (!m) return;
              for (const val of Object.values(m)) {
                if (val && typeof val === 'object' && 'isTexture' in val) {
                  (val as THREE.Texture).dispose();
                }
              }
              m.dispose();
            });
          }
        });
        envTarget.dispose();
        pmrem.dispose();
        renderer.dispose();
        container.innerHTML = '';
      };
    } catch {
      setWebglUnavailable(true);
    }
  }, [config.brideFirstName, config.displayDate, config.groomFirstName, handleUnlockWaypoint]);

  // Direct touch / pointer horizontal drag steering on the 3D stage
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragPointerIdRef.current = e.pointerId;
    dragStartXRef.current = e.clientX;
    dragBaseLaneXRef.current = targetLaneXRef.current;
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragPointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - dragStartXRef.current;
    targetLaneXRef.current = THREE.MathUtils.clamp(
      dragBaseLaneXRef.current + dx * 0.022,
      -3.55,
      3.55
    );
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragPointerIdRef.current === e.pointerId) {
      dragPointerIdRef.current = null;
    }
  };

  const activeEvent = waypoints[selectedCheckpoint] || waypoints[0];

  return (
    <section
      id="ocean-drive-3d"
      className="relative py-16 sm:py-22 px-4 sm:px-6 lg:px-8 bg-[var(--bg-canvas)] border-b border-[#FAF3EA]/10 overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto">
        {/* Clean Editorial × GTA VI Mission Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--accent-3)] mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive 3D Ocean Drive · Real-Time WebGL</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl tracking-[0.07em] vice-sunset-text leading-[0.9]">
              CRUISE TO THE CEREMONY
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF3EA]/70 max-w-sm leading-relaxed">
            Steer {config.displayNames}&rsquo;s sunset convertible down Miami Beach. Drive through
            the glowing golden rings to unlock all {waypoints.length} wedding timings.
          </p>
        </div>

        {/* ============================================================
            3D WEBGL GAMING STAGE (Zero backdrop-blur over WebGL canvas)
            ============================================================ */}
        <div className="relative border border-[#FAF3EA]/18 bg-[#0A090F] shadow-[0_24px_70px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Architectural GTA VI Corner Reticles */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2.5 left-2.5 z-20 w-4 h-4 border-t-2 border-l-2 border-[var(--accent-3)]/80"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2.5 right-2.5 z-20 w-4 h-4 border-t-2 border-r-2 border-[var(--accent-3)]/80"
          />

          {/* Live 3D Viewport */}
          <div
            className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] select-none cursor-grab active:cursor-grabbing"
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerCancel={handleCanvasPointerUp}
          >
            {webglUnavailable ? (
              <div className="relative w-full h-full">
                <img
                  src={EDITORIAL_IMAGES.coupleConvertibleDrive}
                  alt={`${config.displayNames} Ocean Drive convertible sunset`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0A090F]/55 flex flex-col items-center justify-center p-6 text-center">
                  <p className="font-display text-4xl tracking-[0.08em] text-[#FAF3EA]">
                    {config.displayDate.toUpperCase()}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent-3)] mt-2">
                    {config.venueName} · {config.city}
                  </p>
                </div>
              </div>
            ) : (
              <div ref={mountRef} className="w-full h-full" />
            )}

            {/* Top Gaming HUD Strip (Compact, Non-Obstructive, Zero backdrop-blur) */}
            {!hudHidden && !webglUnavailable && (
              <div className="pointer-events-none absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-3">
                {/* Mission Date & Checkpoint Tracker */}
                <div className="bg-[#0A090F]/86 border border-[#FAF3EA]/16 px-3.5 py-2.5">
                  <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[var(--accent-3)]">
                    Wedding Mission · {config.city}
                  </p>
                  <p className="font-display text-xl sm:text-2xl tracking-[0.08em] text-[#FAF3EA] leading-tight mt-0.5">
                    {config.displayDate.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#FAF3EA]/72 tabular-nums">
                      Rings {unlockedIndices.length}/{waypoints.length}
                    </span>
                    <div className="flex items-center gap-1">
                      {waypoints.map((wp, idx) => (
                        <span
                          key={wp.id}
                          className={`w-3.5 h-1 transition-colors ${
                            unlockedIndices.includes(idx)
                              ? 'bg-[var(--accent-3)]'
                              : 'bg-[#FAF3EA]/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Digital Speedometer + Gear */}
                <div className="bg-[#0A090F]/86 border border-[#FAF3EA]/16 px-3.5 py-2 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-[#FAF3EA]/60">
                    <Gauge className="w-3 h-3 text-[var(--accent-1)]" />
                    <span>{turboActive ? 'SPORT S6' : 'CRUISE D4'}</span>
                  </div>
                  <div className="flex items-baseline justify-end gap-1 mt-0.5">
                    <span className="font-display text-3xl sm:text-4xl leading-none tracking-[0.06em] text-[#FAF3EA] tabular-nums">
                      {speedMph}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--accent-3)]">
                      MPH
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Waypoint Unlocked GTA Toast Banner */}
            {unlockBanner && !hudHidden && (
              <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm bg-[#0A090F]/94 border border-[var(--accent-3)] px-4 py-3 text-center shadow-[0_12px_36px_rgba(0,0,0,0.65)]">
                <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-[var(--accent-3)]">
                  Checkpoint 0{unlockBanner.index + 1} Unlocked
                </p>
                <p className="font-display text-2xl tracking-[0.08em] text-[#FAF3EA] leading-tight mt-0.5">
                  {unlockBanner.title.toUpperCase()}
                </p>
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#FAF3EA]/80 mt-0.5">
                  {unlockBanner.time} · {unlockBanner.venue}
                </p>
              </div>
            )}

            {/* Bottom Compact Gaming Control Dock (Touch-Friendly on Phones!) */}
            {!webglUnavailable && (
              <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2">
                {!hudHidden ? (
                  <>
                    {/* Left / Right Steer Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Steer convertible left"
                        onClick={() => stepLane(-1)}
                        onPointerDown={() => {
                          steerHoldRef.current = -1;
                        }}
                        onPointerUp={() => {
                          steerHoldRef.current = 0;
                        }}
                        onPointerLeave={() => {
                          steerHoldRef.current = 0;
                        }}
                        className="inline-flex items-center justify-center gap-1 px-3.5 sm:px-4 min-h-[44px] bg-[#0A090F]/90 border border-[#FAF3EA]/22 hover:border-[var(--accent-3)] active:bg-[var(--accent-3)] active:text-[#0A090F] text-[#FAF3EA] font-mono text-[11px] tracking-[0.16em] uppercase cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden xs:inline sm:inline">Left</span>
                      </button>

                      <button
                        type="button"
                        aria-label="Steer convertible right"
                        onClick={() => stepLane(1)}
                        onPointerDown={() => {
                          steerHoldRef.current = 1;
                        }}
                        onPointerUp={() => {
                          steerHoldRef.current = 0;
                        }}
                        onPointerLeave={() => {
                          steerHoldRef.current = 0;
                        }}
                        className="inline-flex items-center justify-center gap-1 px-3.5 sm:px-4 min-h-[44px] bg-[#0A090F]/90 border border-[#FAF3EA]/22 hover:border-[var(--accent-3)] active:bg-[var(--accent-3)] active:text-[#0A090F] text-[#FAF3EA] font-mono text-[11px] tracking-[0.16em] uppercase cursor-pointer transition-colors"
                      >
                        <span className="hidden xs:inline sm:inline">Right</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Turbo Boost + Camera Presets + Hide HUD */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTurboActive((prev) => !prev)}
                        aria-pressed={turboActive}
                        className={`inline-flex items-center gap-1.5 px-3.5 min-h-[44px] border font-mono text-[10px] sm:text-[11px] tracking-[0.16em] uppercase cursor-pointer transition-colors ${
                          turboActive
                            ? 'vice-cta-bg text-[#0A090F] border-transparent font-semibold'
                            : 'bg-[#0A090F]/90 border-[#FAF3EA]/22 text-[#FAF3EA] hover:border-[var(--accent-1)]'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>{turboActive ? 'Boost On' : 'Boost'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={cycleCamera}
                        className="inline-flex items-center gap-1.5 px-3 min-h-[44px] bg-[#0A090F]/90 border border-[#FAF3EA]/22 hover:border-[var(--accent-cool)] text-[#FAF3EA] font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[var(--accent-cool)]" />
                        <span className="hidden sm:inline">{CAMERA_LABELS[cameraMode]}</span>
                        <span className="sm:hidden">Cam</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHudHidden(true)}
                        aria-label="Hide 3D HUD"
                        className="inline-flex items-center justify-center w-11 min-h-[44px] bg-[#0A090F]/90 border border-[#FAF3EA]/22 hover:border-[#FAF3EA]/50 text-[#FAF3EA]/75 cursor-pointer transition-colors"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setHudHidden(false)}
                    className="ml-auto inline-flex items-center gap-1.5 px-3.5 min-h-[40px] bg-[#0A090F]/88 border border-[#FAF3EA]/24 text-[#FAF3EA] font-mono text-[10px] tracking-[0.18em] uppercase cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--accent-3)]" />
                    <span>Show Controls</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ============================================================
              4-CHECKPOINT WEDDING SCHEDULE MISSION BAR (Clear Date & Timings)
              ============================================================ */}
          <div className="border-t border-[#FAF3EA]/14 bg-[var(--bg-surface)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#FAF3EA]/10">
              {waypoints.map((item, idx) => {
                const unlocked = unlockedIndices.includes(idx);
                const selected = selectedCheckpoint === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCheckpoint(idx)}
                    className={`text-left p-4 transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#FAF3EA]/[0.06] border-t-2 border-t-[var(--accent-3)]'
                        : 'hover:bg-[#FAF3EA]/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--accent-3)]">
                        0{idx + 1} · {item.time}
                      </span>
                      {unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-3)] shrink-0" />
                      )}
                    </div>
                    <p className="font-display text-xl sm:text-2xl tracking-[0.07em] text-[#FAF3EA] leading-none">
                      {item.title.toUpperCase()}
                    </p>
                    <p className="text-[11px] text-[#FAF3EA]/60 mt-1 truncate">
                      {item.location}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Checkpoint Detail Strip */}
            {activeEvent && (
              <div className="px-4 sm:px-6 py-3.5 border-t border-[#FAF3EA]/10 bg-[var(--bg-canvas)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono uppercase tracking-[0.16em]">
                  <span className="text-[var(--accent-3)]">{config.displayDate}</span>
                  <span aria-hidden="true" className="text-[#FAF3EA]/25">
                    ·
                  </span>
                  <span className="text-[#FAF3EA]">{activeEvent.time}</span>
                  <span aria-hidden="true" className="text-[#FAF3EA]/25">
                    ·
                  </span>
                  <span className="text-[#FAF3EA]/72">{activeEvent.location}</span>
                </div>
                <p className="text-xs text-[#FAF3EA]/65">
                  Drag scene or tap Left / Right to steer through golden rings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
