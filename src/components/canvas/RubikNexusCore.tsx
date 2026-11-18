import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { SERVICES_LIST, type ServiceItem } from '../../data/rubikData';

export type NexusDiscipline = 'pillar-01' | 'pillar-02' | 'pillar-03';

export type NexusMode =
  | 'assembled'
  | 'exploded'
  | 'pillar-01'
  | 'pillar-02'
  | 'pillar-03'
  | 'process'
  | 'matrix'
  | 'events'
  | 'compact';

export interface CubieHoverInfo {
  index: number;
  serviceId: string;
  serviceTitle: string;
  screenX: number;
  screenY: number;
}

export interface RubikNexusCoreProps {
  mode: NexusMode;
  scrollProgress: number; // 0 to 1
  activeSection: string;
  interactive?: boolean;
  isMobile?: boolean;
  prefersReducedMotion?: boolean;
  selectedServiceId?: string | null;
  onCubieSelect?: (index: number, label: string, serviceId?: string) => void;
  onCubieHover?: (info: CubieHoverInfo | null) => void;
}

interface CubieDescriptor {
  index: number;
  gx: number; // -1, 0, 1
  gy: number; // -1, 0, 1
  gz: number; // -1, 0, 1
  isSignatureCorner: boolean;
  isGraphiteSurface: boolean;
  serviceId: string;
  serviceTitle: string;
  serviceShortTitle: string;
  focusMode: NexusMode;
  label: string;
  normalDir: THREE.Vector3;
}

interface DragState {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  totalMovedPx: number;
  rotX: number;
  rotY: number;
  velX: number;
  velY: number;
}

const CUBIE_LABELS: string[] = [
  '01 // Enterprise IT Hardware & Compute',
  '02 // Red Hat Enterprise Linux Platform',
  '03 // IBM Hybrid Infrastructure Systems',
  '04 // Huawei Enterprise Network Fabric',
  '05 // Fortinet Zero-Trust Perimeter',
  '06 // Tenable Vulnerability Exposure',
  '07 // Veeam High-Availability Continuity',
  '08 // Hardware-Software Bridge Layer',
  '09 // 24/7 Technical Support & Service Desk',
  '10 // Custom Web & Cloud Applications',
  '11 // Mobile Application Engineering',
  '12 // Full-Stack Java & .NET Systems',
  '13 // DevOps & CI/CD Delivery Pipelines',
  '14 // Nexus Central Integration Core',
  '15 // Automated Software Testing & QA',
  '16 // Scalable Software Architecture',
  '17 // Enterprise Relational Databases',
  '18 // Unified API & Service Mesh',
  '19 // Odoo ERP Core Operations',
  '20 // Salesforce CRM Workflows',
  '21 // Retail POS & Commercial Systems',
  '22 // Industrial Automation Software',
  '23 // Facility Management Platforms',
  '24 // Zebra Specialized Edge Hardware',
  '25 // Business Process Integration',
  '26 // Operational Intelligence Layer',
  '27 // Rubik.I.S Signature Offset Node',
];

function resolveServiceFocusMode(
  service: ServiceItem | undefined,
  serviceIdx: number
): NexusMode {
  const maybeWithMode = service as (ServiceItem & { nexusFocusMode?: NexusMode }) | undefined;
  if (maybeWithMode?.nexusFocusMode) {
    return maybeWithMode.nexusFocusMode;
  }
  const fallbackModes: NexusMode[] = [
    'pillar-01',
    'pillar-01',
    'pillar-02',
    'pillar-03',
    'pillar-03',
    'assembled',
    'matrix',
    'exploded',
  ];
  return fallbackModes[serviceIdx % fallbackModes.length];
}

function computeTargetTransform(
  cubie: CubieDescriptor,
  mode: NexusMode,
  elapsed: number,
  prefersReducedMotion: boolean
): {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
} {
  const { gx, gy, gz, index, isSignatureCorner, normalDir } = cubie;
  const targetPos = new THREE.Vector3();
  const targetRot = new THREE.Euler(0, 0, 0);
  let targetScale = 1.0;

  const baseSpacing = 0.78;

  switch (mode) {
    case 'assembled': {
      targetPos.set(gx * baseSpacing, gy * baseSpacing, gz * baseSpacing);

      if (!prefersReducedMotion && gy === 1) {
        const sliceAngle = Math.sin(elapsed * 0.45) * 0.32;
        const cosA = Math.cos(sliceAngle);
        const sinA = Math.sin(sliceAngle);
        const rx = targetPos.x * cosA - targetPos.z * sinA;
        const rz = targetPos.x * sinA + targetPos.z * cosA;
        targetPos.x = rx;
        targetPos.z = rz;
        targetRot.y = sliceAngle;
      }

      if (isSignatureCorner) {
        const pulse = prefersReducedMotion
          ? 0.22
          : 0.22 + Math.sin(elapsed * 1.9) * 0.05;
        targetPos.x += pulse;
        targetPos.y -= pulse;
        targetPos.z += pulse;
        targetScale = 1.06;
      }
      break;
    }

    case 'exploded': {
      const radialFactor = 1.48;
      const wave = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.25 + index * 0.35) * 0.09;
      targetPos
        .set(gx * radialFactor, gy * radialFactor, gz * radialFactor)
        .addScaledVector(normalDir, 0.35 + wave);

      if (!prefersReducedMotion) {
        targetRot.set(
          gx * 0.22 + Math.sin(elapsed * 0.65 + index) * 0.1,
          gy * 0.22 + Math.cos(elapsed * 0.55 + index) * 0.1,
          gz * 0.22
        );
      }
      targetScale = isSignatureCorner ? 1.12 : 0.94;
      break;
    }

    case 'pillar-01': {
      const tierY = gy * 1.38;
      const rackX = gx * 0.92;
      const rackZ = gz * 0.92;
      const scanOffset = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.6 + gy * 1.2) * 0.07;
      targetPos.set(rackX + scanOffset, tierY, rackZ);
      targetRot.set(0, gy * 0.18, 0);
      targetScale = 0.96;
      break;
    }

    case 'pillar-02': {
      const normalizedIdx = index - 13;
      const angle = index * 0.52 + (prefersReducedMotion ? 0 : elapsed * 0.32);
      const radius = index === 13 ? 0 : 1.55 + (index % 2) * 0.55;
      const height = normalizedIdx * 0.15;
      targetPos.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      targetRot.set(0.2, -angle, 0.15);
      targetScale = 0.88;
      break;
    }

    case 'pillar-03': {
      const ringGroup = gy + 1; // 0, 1, 2
      const ringItemIndex = (gx + 1) * 3 + (gz + 1); // 0..8
      if (gx === 0 && gy === 0 && gz === 0) {
        targetPos.set(0, 0, 0);
        targetScale = 1.18;
      } else {
        const ringRadius = 1.25 + ringGroup * 0.72;
        const baseAngle =
          (ringItemIndex / 9) * Math.PI * 2 +
          (prefersReducedMotion
            ? 0
            : elapsed *
              (0.26 - ringGroup * 0.06) *
              (ringGroup % 2 === 0 ? 1 : -1));
        const tiltY = Math.sin(baseAngle * 2) * (0.25 + ringGroup * 0.12);
        targetPos.set(
          Math.cos(baseAngle) * ringRadius,
          tiltY + gy * 0.35,
          Math.sin(baseAngle) * ringRadius
        );
        targetRot.set(tiltY * 0.4, -baseAngle, 0);
        targetScale = 0.86;
      }
      break;
    }

    case 'process': {
      const stageBucket = Math.min(3, Math.floor((index / 27) * 4)); // 0..3
      const localIdx = index - stageBucket * 7;
      const stageX = (stageBucket - 1.5) * 1.15;
      const stageY = (stageBucket - 1.5) * 0.42;
      const laneZ = ((localIdx % 3) - 1) * 0.82;
      const depthShift = (Math.floor(localIdx / 3) - 0.5) * 0.55;
      const flowPulse = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.4 - stageBucket * 0.85) * 0.1;

      targetPos.set(stageX + depthShift * 0.35, stageY + flowPulse, laneZ);
      targetRot.set(0.12, stageBucket * 0.18, 0.08);
      targetScale = stageBucket === 3 && isSignatureCorner ? 1.04 : 0.86;
      break;
    }

    case 'matrix': {
      const matrixSpacing = 1.18;
      const waveY = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.35 + gx * 0.9 + gz * 0.9) * 0.15;
      targetPos.set(
        gx * matrixSpacing,
        gy * matrixSpacing + waveY,
        gz * matrixSpacing
      );
      targetRot.set(
        prefersReducedMotion ? 0 : Math.sin(elapsed * 0.45 + index) * 0.08,
        prefersReducedMotion ? 0 : Math.cos(elapsed * 0.45 + index) * 0.08,
        0
      );
      targetScale = 0.92;
      break;
    }

    case 'events': {
      if (index === 13) {
        targetPos.set(0, 0, 0);
        targetScale = 1.05;
      } else {
        const arcAngle =
          (index / 26) * Math.PI * 1.65 -
          Math.PI * 0.825 +
          (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.3) * 0.06);
        const arcRadius = 2.05 + (index % 2) * 0.45;
        const arcY =
          gy * 0.85 +
          (prefersReducedMotion
            ? 0
            : Math.cos(elapsed * 0.9 + index * 0.4) * 0.08);
        targetPos.set(
          Math.sin(arcAngle) * arcRadius,
          arcY,
          -Math.cos(arcAngle) * arcRadius * 0.65 - 0.2
        );
        targetRot.set(0, -arcAngle * 0.65, 0);
        targetScale = isSignatureCorner ? 1.02 : 0.84;
      }
      break;
    }

    case 'compact': {
      const compactSpacing = 0.74;
      targetPos.set(
        gx * compactSpacing,
        gy * compactSpacing,
        gz * compactSpacing
      );
      if (isSignatureCorner) {
        targetPos.addScaledVector(normalDir, 0.24);
      }
      targetScale = 0.88;
      break;
    }
  }

  return { position: targetPos, rotation: targetRot, scale: targetScale };
}

export const RubikNexusCore: React.FC<RubikNexusCoreProps> = ({
  mode,
  scrollProgress,
  activeSection,
  interactive = true,
  isMobile = false,
  prefersReducedMotion = false,
  selectedServiceId = null,
  onCubieSelect,
  onCubieHover,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const innerRing1Ref = useRef<THREE.Mesh>(null);
  const innerRing2Ref = useRef<THREE.Mesh>(null);
  const cubieRefs = useRef<(THREE.Group | null)[]>([]);
  const rimMaterialRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const focusTiltRef = useRef<{ x: number; y: number; curX: number; curY: number }>({
    x: 0,
    y: 0,
    curX: 0,
    curY: 0,
  });
  const selectionPulseRef = useRef<{ index: number | null; startedAt: number }>({
    index: null,
    startedAt: 0,
  });

  useEffect(() => {
    if (!selectedServiceId) {
      setSelectedIndex(null);
      focusTiltRef.current.x = 0;
      focusTiltRef.current.y = 0;
      selectionPulseRef.current.index = null;
    }
  }, [selectedServiceId]);

  const dragRef = useRef<DragState>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    totalMovedPx: 0,
    rotX: 0,
    rotY: 0,
    velX: 0,
    velY: 0,
  });

  const { viewport, gl, camera } = useThree();
  const isWideViewport = viewport.width >= 7.2;
  const onCubieHoverRef = useRef(onCubieHover);
  onCubieHoverRef.current = onCubieHover;
  const lastReportedHoverRef = useRef<{
    index: number;
    screenX: number;
    screenY: number;
  } | null>(null);
  const tempProjVec = useMemo(() => new THREE.Vector3(), []);

  const projectCubieToViewport = (
    cubieIndex: number
  ): { screenX: number; screenY: number } | null => {
    const group = cubieRefs.current[cubieIndex];
    if (!group || !gl.domElement) return null;
    group.getWorldPosition(tempProjVec);
    tempProjVec.project(camera);
    const rect = gl.domElement.getBoundingClientRect();
    const screenX = rect.left + (tempProjVec.x * 0.5 + 0.5) * rect.width;
    const screenY = rect.top + (-tempProjVec.y * 0.5 + 0.5) * rect.height;
    return { screenX, screenY };
  };

  // Pointer drag rotation ("DRAG TO EXPLORE") with inertia damping
  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement || !interactive) return;

    const handleDomPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragRef.current.isDragging = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      dragRef.current.totalMovedPx = 0;
      dragRef.current.velX = 0;
      dragRef.current.velY = 0;
    };

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;

      const moved = Math.hypot(dx, dy);
      dragRef.current.totalMovedPx += moved;

      if (dragRef.current.totalMovedPx > 3) {
        document.documentElement.dataset.nexusDragging3d = 'true';
        if (lastReportedHoverRef.current) {
          lastReportedHoverRef.current = null;
          onCubieHoverRef.current?.(null);
        }
        if (!document.documentElement.classList.contains('nexus-cursor-active')) {
          document.body.style.cursor = 'grabbing';
        }
      }

      const deltaRotY = dx * 0.0085;
      const deltaRotX = dy * 0.0065;
      dragRef.current.velY = deltaRotY;
      dragRef.current.velX = deltaRotX;
      dragRef.current.rotY += deltaRotY;
      dragRef.current.rotX = THREE.MathUtils.clamp(
        dragRef.current.rotX + deltaRotX,
        -1.2,
        1.2
      );
    };

    const finishDrag = () => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;
      delete document.documentElement.dataset.nexusDragging3d;
      if (!document.documentElement.classList.contains('nexus-cursor-active')) {
        document.body.style.cursor = 'auto';
      }
    };

    const handleDomPointerLeave = () => {
      setHoveredIndex((prev) => (prev !== null ? null : prev));
      if (lastReportedHoverRef.current) {
        lastReportedHoverRef.current = null;
        onCubieHoverRef.current?.(null);
      }
      if (typeof document !== 'undefined') {
        delete document.documentElement.dataset.nexusCubieHover;
      }
    };

    domElement.addEventListener('pointerdown', handleDomPointerDown);
    domElement.addEventListener('pointerleave', handleDomPointerLeave);
    window.addEventListener('pointermove', handleWindowPointerMove, {
      passive: true,
    });
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);

    return () => {
      domElement.removeEventListener('pointerdown', handleDomPointerDown);
      domElement.removeEventListener('pointerleave', handleDomPointerLeave);
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
      delete document.documentElement.dataset.nexusDragging3d;
    };
  }, [gl, interactive]);

  // Build the 27 cubie descriptors deterministically mapped across SERVICES_LIST
  const cubies = useMemo<CubieDescriptor[]>(() => {
    const list: CubieDescriptor[] = [];
    const serviceCount = Math.max(1, SERVICES_LIST.length);
    let idx = 0;

    for (let gy = 1; gy >= -1; gy--) {
      for (let gz = 1; gz >= -1; gz--) {
        for (let gx = -1; gx <= 1; gx++) {
          const isSignatureCorner = gx === 1 && gy === -1 && gz === 1;
          const isGraphiteSurface =
            (Math.abs(gx) + Math.abs(gy) + Math.abs(gz)) % 2 === 1;
          const normalDir = new THREE.Vector3(gx, gy, gz);
          if (normalDir.lengthSq() > 0) {
            normalDir.normalize();
          } else {
            normalDir.set(0, 1, 0);
          }

          const serviceIdx = idx % serviceCount;
          const service = SERVICES_LIST[serviceIdx];

          list.push({
            index: idx,
            gx,
            gy,
            gz,
            isSignatureCorner,
            isGraphiteSurface,
            serviceId: service?.id ?? `service-${serviceIdx + 1}`,
            serviceTitle: service?.title ?? `Rubik Service ${serviceIdx + 1}`,
            serviceShortTitle:
              service?.shortTitle ?? service?.title ?? `Service ${serviceIdx + 1}`,
            focusMode: resolveServiceFocusMode(service, serviceIdx),
            label: isSignatureCorner
              ? '27 // Rubik.I.S Signature Offset Node [1,-1,1]'
              : CUBIE_LABELS[idx] || `Module ${idx + 1}`,
            normalDir,
          });
          idx++;
        }
      }
    }
    return list;
  }, []);

  // Shared single RoundedBoxGeometry + EdgesGeometry reused across all 27 cubies
  const sharedCubieGeometry = useMemo(
    () => new RoundedBoxGeometry(0.68, 0.68, 0.68, isMobile ? 2 : 3, 0.075),
    [isMobile]
  );

  const sharedEdgesGeometry = useMemo(() => {
    const edgeSourceBox = new THREE.BoxGeometry(0.692, 0.692, 0.692);
    const edges = new THREE.EdgesGeometry(edgeSourceBox);
    edgeSourceBox.dispose();
    return edges;
  }, []);

  useEffect(() => {
    return () => {
      sharedCubieGeometry.dispose();
    };
  }, [sharedCubieGeometry]);

  useEffect(() => {
    return () => {
      sharedEdgesGeometry.dispose();
    };
  }, [sharedEdgesGeometry]);

  // Shared materials: lightweight MeshStandardMaterial on mobile, MeshPhysicalMaterial on desktop
  const materials = useMemo(() => {
    if (isMobile) {
      return {
        obsidian: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#0B1222'),
          emissive: new THREE.Color('#080D1A'),
          emissiveIntensity: 0.24,
          metalness: 0.86,
          roughness: 0.24,
        }),
        graphite: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#151B29'),
          emissive: new THREE.Color('#0B111E'),
          emissiveIntensity: 0.2,
          metalness: 0.9,
          roughness: 0.28,
        }),
        highlightedService: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#0E2242'),
          emissive: new THREE.Color('#38BDF8'),
          emissiveIntensity: 0.36,
          metalness: 0.82,
          roughness: 0.16,
        }),
        dimmedObsidian: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#060913'),
          emissive: new THREE.Color('#04070E'),
          emissiveIntensity: 0.08,
          metalness: 0.72,
          roughness: 0.36,
          transparent: true,
          opacity: 0.56,
        }),
        signature: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#0E1E3A'),
          emissive: new THREE.Color('#38BDF8'),
          emissiveIntensity: 0.34,
          metalness: 0.8,
          roughness: 0.16,
        }),
        hovered: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#11294E'),
          emissive: new THREE.Color('#38BDF8'),
          emissiveIntensity: 0.48,
          metalness: 0.78,
          roughness: 0.14,
        }),
        selectedBlock: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#143261'),
          emissive: new THREE.Color('#38BDF8'),
          emissiveIntensity: 0.62,
          metalness: 0.76,
          roughness: 0.12,
        }),
      };
    }

    return {
      obsidian: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0B1222'),
        emissive: new THREE.Color('#080D1A'),
        emissiveIntensity: 0.24,
        metalness: 0.88,
        roughness: 0.22,
        clearcoat: 0.95,
        clearcoatRoughness: 0.14,
        reflectivity: 0.92,
      }),
      graphite: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#151B29'),
        emissive: new THREE.Color('#0B111E'),
        emissiveIntensity: 0.2,
        metalness: 0.92,
        roughness: 0.26,
        clearcoat: 0.85,
        clearcoatRoughness: 0.18,
        reflectivity: 0.88,
      }),
      highlightedService: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0E2242'),
        emissive: new THREE.Color('#38BDF8'),
        emissiveIntensity: 0.36,
        metalness: 0.84,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
      }),
      dimmedObsidian: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#060913'),
        emissive: new THREE.Color('#04070E'),
        emissiveIntensity: 0.08,
        metalness: 0.72,
        roughness: 0.36,
        clearcoat: 0.4,
        transparent: true,
        opacity: 0.56,
      }),
      signature: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0E1E3A'),
        emissive: new THREE.Color('#38BDF8'),
        emissiveIntensity: 0.34,
        metalness: 0.82,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
      }),
      hovered: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#11294E'),
        emissive: new THREE.Color('#38BDF8'),
        emissiveIntensity: 0.48,
        metalness: 0.8,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
      }),
      selectedBlock: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#143261'),
        emissive: new THREE.Color('#38BDF8'),
        emissiveIntensity: 0.62,
        metalness: 0.78,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
      }),
    };
  }, [isMobile]);

  useEffect(() => {
    return () => {
      materials.obsidian.dispose();
      materials.graphite.dispose();
      materials.highlightedService.dispose();
      materials.dimmedObsidian.dispose();
      materials.signature.dispose();
      materials.hovered.dispose();
      materials.selectedBlock.dispose();
    };
  }, [materials]);

  // Reusable scratch objects to avoid GC allocation inside useFrame
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempScaleVec = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const rootTargetPos = useMemo(() => new THREE.Vector3(), []);
  const rootTargetScaleVec = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (
      isMobile &&
      scrollProgress > 0.25 &&
      activeSection !== 'hero' &&
      activeSection !== 'contact'
    ) {
      return;
    }

    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.getElapsedTime();
    const vw = state.viewport.width;
    const isDesktopWide = vw >= 7.2 || isWideViewport;
    const isLandscapeTablet = vw >= 5.2 && vw < 7.2;
    const isPortraitTablet = vw >= 3.4 && vw < 5.2;

    const drag = dragRef.current;
    if (!drag.isDragging) {
      const damping = Math.exp(-5.5 * dt);
      drag.velX *= damping;
      drag.velY *= damping;
      if (Math.abs(drag.velX) < 0.0001) drag.velX = 0;
      if (Math.abs(drag.velY) < 0.0001) drag.velY = 0;
      drag.rotX = THREE.MathUtils.clamp(drag.rotX + drag.velX, -1.2, 1.2);
      drag.rotY += drag.velY;
    }

    // 1. Update Root Group Position, Responsive Scale & Rotation
    if (rootGroupRef.current) {
      let sectionX = 0;
      let sectionY = 0;
      let sectionZ = 0;
      let baseScale = 1.0;

      const desktopHeroOffsetX = THREE.MathUtils.clamp(vw * 0.09, 0.55, 1.05);
      const desktopSectionOffsetX = THREE.MathUtils.clamp(vw * 0.14, 0.95, 1.45);

      if (activeSection === 'hero') {
        if (isDesktopWide) {
          sectionX = desktopHeroOffsetX;
          sectionY = 0.06;
          sectionZ = 0.25;
          baseScale = THREE.MathUtils.clamp(vw * 0.132, 1.14, 1.22);
        } else if (isLandscapeTablet) {
          sectionX = THREE.MathUtils.clamp(vw * 0.055, 0.2, 0.42);
          sectionY = 0.04;
          sectionZ = 0.0;
          baseScale = 1.04;
        } else if (isPortraitTablet) {
          sectionX = 0;
          sectionY = 0.05;
          sectionZ = -0.35;
          baseScale = 0.92;
        } else {
          sectionX = 0;
          sectionY = 0.08;
          sectionZ = -0.65;
          baseScale = THREE.MathUtils.clamp(vw * 0.31, 0.68, 0.82);
        }
      } else if (activeSection === 'solutions' || activeSection === 'approach') {
        sectionX = isDesktopWide ? desktopSectionOffsetX * 0.88 : 0;
        sectionY = 0.02;
        sectionZ = -0.45;
        baseScale = isDesktopWide
          ? 1.02
          : isLandscapeTablet
          ? 0.94
          : isPortraitTablet
          ? 0.84
          : THREE.MathUtils.clamp(vw * 0.29, 0.64, 0.78);
      } else if (activeSection === 'services' || activeSection === 'about') {
        sectionX = isDesktopWide ? -desktopSectionOffsetX * 0.88 : 0;
        sectionY = 0;
        sectionZ = -1.1;
        baseScale = isDesktopWide
          ? 0.98
          : isLandscapeTablet
          ? 0.88
          : isPortraitTablet
          ? 0.8
          : THREE.MathUtils.clamp(vw * 0.27, 0.6, 0.74);
      } else {
        sectionX = isDesktopWide ? desktopSectionOffsetX * 0.78 : 0;
        sectionY = 0;
        sectionZ = -1.25;
        baseScale = isDesktopWide
          ? 0.96
          : isLandscapeTablet
          ? 0.86
          : isPortraitTablet
          ? 0.78
          : THREE.MathUtils.clamp(vw * 0.26, 0.58, 0.72);
      }

      if (mode === 'exploded' || mode === 'events') {
        baseScale *= 0.92;
      }

      const floatY = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.05) * 0.12;
      const floatX = prefersReducedMotion
        ? 0
        : Math.cos(elapsed * 0.7) * 0.05;

      rootTargetPos.set(sectionX + floatX, sectionY + floatY, sectionZ);
      rootGroupRef.current.position.lerp(rootTargetPos, dt * 3.2);

      rootTargetScaleVec.set(baseScale, baseScale, baseScale);
      rootGroupRef.current.scale.lerp(rootTargetScaleVec, dt * 3.5);

      const pointerX = interactive ? state.pointer.x : 0;
      const pointerY = interactive ? state.pointer.y : 0;

      const focusTilt = focusTiltRef.current;
      focusTilt.curX = THREE.MathUtils.lerp(focusTilt.curX, focusTilt.x, dt * 3.8);
      focusTilt.curY = THREE.MathUtils.lerp(focusTilt.curY, focusTilt.y, dt * 3.8);

      const baseRotX =
        0.36 +
        scrollProgress * Math.PI * 0.55 +
        (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.32) * 0.07) -
        pointerY * 0.24 +
        focusTilt.curX +
        drag.rotX;

      const baseRotY =
        -0.62 +
        scrollProgress * Math.PI * 1.25 +
        (prefersReducedMotion ? 0 : elapsed * 0.14) +
        pointerX * 0.35 +
        focusTilt.curY +
        drag.rotY;

      const baseRotZ = prefersReducedMotion
        ? 0.06
        : Math.cos(elapsed * 0.25) * 0.05;

      const rotSpeed = drag.isDragging ? 14.0 : 4.5;
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        baseRotX,
        dt * rotSpeed
      );
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        baseRotY,
        dt * rotSpeed
      );
      rootGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.z,
        baseRotZ,
        dt * 4.0
      );
    }

    // 2. Animate Inner Quantum Core & Gyroscopic Rings
    if (coreMeshRef.current) {
      if (!prefersReducedMotion) {
        coreMeshRef.current.rotation.y += dt * 0.75;
        coreMeshRef.current.rotation.x += dt * 0.45;
      }
      const coreScale =
        mode === 'exploded' ||
        mode === 'pillar-03' ||
        mode === 'matrix' ||
        mode === 'events'
          ? 1.12 + (prefersReducedMotion ? 0 : Math.sin(elapsed * 2.4) * 0.07)
          : 0.7;
      tempScaleVec.set(coreScale, coreScale, coreScale);
      coreMeshRef.current.scale.lerp(tempScaleVec, dt * 4.5);
    }

    if (innerRing1Ref.current && !prefersReducedMotion) {
      innerRing1Ref.current.rotation.z += dt * 0.55;
      innerRing1Ref.current.rotation.x += dt * 0.28;
    }
    if (innerRing2Ref.current && !prefersReducedMotion) {
      innerRing2Ref.current.rotation.y -= dt * 0.62;
      innerRing2Ref.current.rotation.z += dt * 0.22;
    }

    // 3. Update All 27 Individual Cubies (Idle / Hover / Selection + Focus / Transition)
    const hasServiceFocus = Boolean(selectedServiceId);
    const pulseState = selectionPulseRef.current;
    const pulseAgeSec =
      pulseState.index !== null && !prefersReducedMotion
        ? (performance.now() - pulseState.startedAt) / 1000
        : 999;
    const pulseEnvelope =
      pulseAgeSec < 0.65
        ? Math.sin((pulseAgeSec / 0.65) * Math.PI)
        : 0;

    for (let i = 0; i < cubies.length; i++) {
      const cubieGroup = cubieRefs.current[i];
      if (!cubieGroup) continue;

      const cubie = cubies[i];
      const isHovered = hoveredIndex === i;
      const isSelected = selectedIndex === i;
      const isServiceMatch =
        hasServiceFocus && cubie.serviceId === selectedServiceId;

      const { position, rotation, scale } = computeTargetTransform(
        cubie,
        mode,
        elapsed,
        prefersReducedMotion
      );

      if (isSelected && hasServiceFocus) {
        position.addScaledVector(cubie.normalDir, 0.38 + pulseEnvelope * 0.2);
      } else if (isHovered) {
        position.addScaledVector(cubie.normalDir, 0.32);
      } else if (isServiceMatch) {
        position.addScaledVector(cubie.normalDir, 0.22 + pulseEnvelope * 0.08);
      } else if (hasServiceFocus) {
        position.addScaledVector(cubie.normalDir, -0.08);
      }

      cubieGroup.position.lerp(position, dt * 6.5);

      tempQuat.setFromEuler(rotation);
      cubieGroup.quaternion.slerp(tempQuat, dt * 6.5);

      const finalScale =
        isSelected && hasServiceFocus
          ? scale * (1.1 + pulseEnvelope * 0.06)
          : isHovered
          ? scale * 1.1
          : isServiceMatch
          ? scale * 1.06
          : hasServiceFocus
          ? scale * 0.9
          : scale;
      tempVec.set(finalScale, finalScale, finalScale);
      cubieGroup.scale.lerp(tempVec, dt * 8.0);

      // Selective cyber cyan/violet edge rim opacity
      const rimMat = rimMaterialRefs.current[i];
      if (rimMat) {
        const targetOpacity = isHovered
          ? 0.98
          : isServiceMatch
          ? 0.92
          : hasServiceFocus
          ? 0.14
          : cubie.isSignatureCorner
          ? 0.88
          : isSelected
          ? 0.72
          : mode === 'exploded' || mode === 'pillar-02' || mode === 'process'
          ? 0.62
          : 0.38;

        rimMat.opacity = THREE.MathUtils.lerp(
          rimMat.opacity,
          targetOpacity,
          dt * 8.0
        );
      }
    }

    // 4. Project hovered cubie world position to 2D viewport coords (throttled > 2px)
    if (
      hoveredIndex !== null &&
      !(dragRef.current.isDragging && dragRef.current.totalMovedPx > 3)
    ) {
      const projected = projectCubieToViewport(hoveredIndex);
      if (projected) {
        const last = lastReportedHoverRef.current;
        const deltaMoved = last
          ? Math.hypot(
              projected.screenX - last.screenX,
              projected.screenY - last.screenY
            )
          : Infinity;

        if (!last || last.index !== hoveredIndex || deltaMoved > 2) {
          const cubie = cubies[hoveredIndex];
          if (cubie) {
            lastReportedHoverRef.current = {
              index: hoveredIndex,
              screenX: projected.screenX,
              screenY: projected.screenY,
            };
            onCubieHover?.({
              index: cubie.index,
              serviceId: cubie.serviceId,
              serviceTitle: cubie.serviceTitle,
              screenX: projected.screenX,
              screenY: projected.screenY,
            });
          }
        }
      }
    }
  });

  const handlePointerOver = (
    e: ThreeEvent<PointerEvent>,
    cubie: CubieDescriptor
  ) => {
    if (!interactive) return;
    e.stopPropagation();
    setHoveredIndex(cubie.index);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.nexusCubieHover = 'true';
      if (
        !document.documentElement.classList.contains('nexus-cursor-active') &&
        !dragRef.current.isDragging
      ) {
        document.body.style.cursor = 'pointer';
      }
    }
    if (dragRef.current.isDragging && dragRef.current.totalMovedPx > 3) return;
    const projected = projectCubieToViewport(cubie.index) ?? {
      screenX: e.clientX,
      screenY: e.clientY,
    };
    lastReportedHoverRef.current = {
      index: cubie.index,
      screenX: projected.screenX,
      screenY: projected.screenY,
    };
    onCubieHover?.({
      index: cubie.index,
      serviceId: cubie.serviceId,
      serviceTitle: cubie.serviceTitle,
      screenX: projected.screenX,
      screenY: projected.screenY,
    });
  };

  const handlePointerOut = (
    e: ThreeEvent<PointerEvent>,
    cubie: CubieDescriptor
  ) => {
    if (!interactive) return;
    e.stopPropagation();
    setHoveredIndex((prev) => (prev === cubie.index ? null : prev));
    if (lastReportedHoverRef.current?.index === cubie.index) {
      lastReportedHoverRef.current = null;
      onCubieHover?.(null);
      if (typeof document !== 'undefined') {
        delete document.documentElement.dataset.nexusCubieHover;
        if (
          !document.documentElement.classList.contains('nexus-cursor-active') &&
          !dragRef.current.isDragging
        ) {
          document.body.style.cursor = 'auto';
        }
      }
    }
  };

  const handleClick = (
    e: ThreeEvent<MouseEvent>,
    cubie: CubieDescriptor
  ) => {
    if (!interactive) return;
    e.stopPropagation();
    if (dragRef.current.totalMovedPx > 6) return;

    const isSameBlockToggleOff =
      selectedIndex === cubie.index && selectedServiceId === cubie.serviceId;

    if (isSameBlockToggleOff) {
      setSelectedIndex(null);
      focusTiltRef.current.x = 0;
      focusTiltRef.current.y = 0;
      selectionPulseRef.current.index = null;
    } else {
      setSelectedIndex(cubie.index);
      selectionPulseRef.current = {
        index: cubie.index,
        startedAt: performance.now(),
      };
      if (!prefersReducedMotion) {
        focusTiltRef.current.x = THREE.MathUtils.clamp(-cubie.gy * 0.22, -0.28, 0.28);
        focusTiltRef.current.y = THREE.MathUtils.clamp(-cubie.gx * 0.34, -0.45, 0.45);
      }
    }

    onCubieSelect?.(
      cubie.index,
      `${cubie.serviceTitle} // ${cubie.label}`,
      cubie.serviceId
    );
  };

  const hasServiceFocus = Boolean(selectedServiceId);

  return (
    <group ref={rootGroupRef} name="rubik-nexus-core-root">
      {/* Inner Holographic Quantum Core (non-raycastable so outer cubies always win) */}
      <group name="nexus-inner-quantum-core">
        <mesh ref={coreMeshRef} raycast={() => null}>
          <octahedronGeometry args={[0.62, 1]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#38BDF8"
            emissiveIntensity={1.4}
            wireframe
            transparent
            opacity={0.68}
          />
        </mesh>
        <mesh raycast={() => null}>
          <sphereGeometry args={[0.36, 24, 24]} />
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.38}
          />
        </mesh>
        <mesh ref={innerRing1Ref} raycast={() => null}>
          <torusGeometry args={[0.95, 0.013, 16, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.48}
          />
        </mesh>
        <mesh
          ref={innerRing2Ref}
          rotation={[Math.PI / 2, 0.4, 0]}
          raycast={() => null}
        >
          <torusGeometry args={[1.18, 0.011, 16, 64]} />
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.38}
          />
        </mesh>
      </group>

      {/* 27 Modular 3x3x3 Service Cubies */}
      {cubies.map((cubie, idx) => {
        const isHovered = hoveredIndex === idx;
        const isServiceMatch =
          hasServiceFocus && cubie.serviceId === selectedServiceId;
        const isCyberPrimary =
          isHovered ||
          isServiceMatch ||
          cubie.isSignatureCorner ||
          (cubie.gx + cubie.gy + cubie.gz) % 2 === 0;
        const seamHex = isCyberPrimary ? '#38BDF8' : '#6366F1';

        let bodyMaterial: THREE.Material;
        if (hasServiceFocus && selectedIndex === idx) {
          bodyMaterial = materials.selectedBlock;
        } else if (isHovered) {
          bodyMaterial = materials.hovered;
        } else if (hasServiceFocus) {
          bodyMaterial = isServiceMatch
            ? cubie.isSignatureCorner
              ? materials.signature
              : materials.highlightedService
            : materials.dimmedObsidian;
        } else {
          bodyMaterial = cubie.isSignatureCorner
            ? materials.signature
            : cubie.isGraphiteSurface
            ? materials.graphite
            : materials.obsidian;
        }

        return (
          <group
            key={cubie.index}
            ref={(el) => {
              cubieRefs.current[idx] = el;
            }}
            position={[cubie.gx * 0.78, cubie.gy * 0.78, cubie.gz * 0.78]}
          >
            {/* Shared RoundedBoxGeometry Cubie Shell — exclusive raycast target */}
            <mesh
              geometry={sharedCubieGeometry}
              material={bodyMaterial}
              onPointerOver={(e) => handlePointerOver(e, cubie)}
              onPointerOut={(e) => handlePointerOut(e, cubie)}
              onClick={(e) => handleClick(e, cubie)}
            />

            {/* Shared EdgesGeometry Selective Glowing Edge Seam (non-raycastable) */}
            <lineSegments geometry={sharedEdgesGeometry} raycast={() => null}>
              <lineBasicMaterial
                ref={(el) => {
                  rimMaterialRefs.current[idx] = el;
                }}
                color={seamHex}
                transparent
                opacity={cubie.isSignatureCorner ? 0.88 : 0.38}
              />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
};
