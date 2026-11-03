'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import type { Sector } from '@/lib/skills';

interface RacingCarProps {
  isPaused: boolean;
  trailingOffset?: number; // Progress offset for trailing car (0-1)
  color?: string; // Car color
}

interface SectorMarkerProps {
  sector: Sector;
  onClick: () => void;
  isActive: boolean;
}


const TRACK_CONFIG = {
  SCALE: 9,
  WIDTH: 2.3,
  SEGMENTS: 256,
  BARRIER_OFFSET: 1.1,
  CURB_OFFSET: 1.05,
  CENTER_LINE_DASH: 0.3,
  CENTER_LINE_GAP: 0.2,
};

const CAR_PHYSICS = {
  BASE_SPEED: 0.002,
  MAX_SPEED: 0.004,
  MIN_SPEED: 0.001,
  CURVATURE_PENALTY: 0.3,
  WHEEL_ROTATION_SPEED: 0.5,
  SMOOTH_FACTOR: 0.08,
};

const CAMERA_CONFIG = {
  POSITION: [7, 10, 14] as [number, number, number],
  FOV: 55,
  AUTO_ROTATE_SPEED: 0.5,
  MIN_DISTANCE: 6,
  MAX_DISTANCE: 40,
  MAX_POLAR_ANGLE: Math.PI / 2.2,
};

const LIGHTING_CONFIG = {
  AMBIENT_INTENSITY: 0.4,
  DIRECTIONAL_INTENSITY: 1.5,
  DIRECTIONAL_POSITION: [10, 15, 10] as [number, number, number],
};


// ============================================================================
// GEOMETRY UTILITIES
// ============================================================================

class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  scale: number;

  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t: number): THREE.Vector3 {
    const angle = t * 2 * Math.PI;
    const a = this.scale;
    
    const denominator = 1 + Math.sin(angle) ** 2;
    const x = (a * Math.cos(angle)) / denominator;
    const z = (a * Math.sin(angle) * Math.cos(angle)) / denominator;
    
    let y = 0;
    const bridgeHeight = 2.5;

    // Define the entire section that will be elevated (e.g., the "right" half/loop)
    const startRamp = 0.0;
    const endRamp = 0.6; 
    // We will transition from 0 to 0.1, stay flat until 0.5, and transition from 0.5 to 0.6

    if (t >= startRamp && t <= endRamp) {
        const rampUpEnd = 0.15;   // t from 0.0 to 0.15: Longer, smoother Ramp Up
        const rampDownStart = 0.45; // t from 0.45 to 0.6: Longer, smoother Ramp Down

        if (t < rampUpEnd) {
            // Ultra-Smooth Ramp Up using quintic smoothstep (t=0.0 to t=0.15)
            const progress = (t - startRamp) / (rampUpEnd - startRamp);
            // Quintic smoothstep: 6t^5 - 15t^4 + 10t^3
            const smoothProgress = progress * progress * progress * 
                                   (progress * (progress * 6 - 15) + 10);
            y = smoothProgress * bridgeHeight;
        } else if (t <= rampDownStart) {
            // Flat Bridge Deck (t=0.15 to t=0.45)
            y = bridgeHeight;
        } else { 
            // Ultra-Smooth Ramp Down using quintic smoothstep (t=0.45 to t=0.6)
            const progress = (endRamp - t) / (endRamp - rampDownStart);
            // Quintic smoothstep: 6t^5 - 15t^4 + 10t^3
            const smoothProgress = progress * progress * progress * 
                                   (progress * (progress * 6 - 15) + 10);
            y = smoothProgress * bridgeHeight;
        }
    }
    // For t > 0.6 and t <= 1.0, y remains 0 (the left loop is flat)

    return new THREE.Vector3(x, y, z);
  }
}

function createFlatTrackGeometry(
  curve: THREE.Curve<THREE.Vector3>, 
  width: number, 
  segments: number
): THREE.BufferGeometry {
  const points = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    
    const perpendicular = new THREE.Vector3()
      .crossVectors(tangent, up)
      .normalize();

    const leftPoint = point.clone().add(perpendicular.clone().multiplyScalar(width / 2));
    const rightPoint = point.clone().sub(perpendicular.clone().multiplyScalar(width / 2));

    points.push(leftPoint, rightPoint);
  }

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(points.length * 3);
  const uvs = new Float32Array(points.length * 2);
  
  for (let i = 0; i < points.length; i++) {
    vertices[i * 3] = points[i].x;
    vertices[i * 3 + 1] = points[i].y;
    vertices[i * 3 + 2] = points[i].z;
    
    uvs[i * 2] = (i % 2);
    uvs[i * 2 + 1] = Math.floor(i / 2) / segments;
  }

  const indices = [];
  for (let i = 0; i < segments; i++) {
    const i1 = i * 2;
    const i2 = i * 2 + 1;
    const i3 = i * 2 + 2;
    const i4 = i * 2 + 3;

    indices.push(i1, i2, i3);
    indices.push(i2, i4, i3);
  }

  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();

  return geometry;
}

function createBarrierGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  offset: number,
  segments: number = 256
): THREE.BufferGeometry {
  const points = [];
  const up = new THREE.Vector3(0, 1, 0);
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    const perpendicular = new THREE.Vector3()
      .crossVectors(tangent, up)
      .normalize();
    
    const barrierPoint = point.clone().add(perpendicular.clone().multiplyScalar(offset));
    barrierPoint.y += 0.15;
    points.push(barrierPoint);
  }
  
  return new THREE.BufferGeometry().setFromPoints(points);
}

function createCenterLineGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  segments: number = 256
): THREE.BufferGeometry {
  const points = [];
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPoint(t);
    point.y += 0.02;
    points.push(point);
  }
  
  return new THREE.BufferGeometry().setFromPoints(points);
}

// ============================================================================
// MATERIAL UTILITIES
// ============================================================================

function createAsphaltTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return new THREE.Texture();
  
  // Base dark asphalt color
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 512, 512);
  
  // Add fine grain texture for realism
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.fillRect(x, y, 2, 2);
  }
  
  // Add subtle larger patches for variation
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.floor(Math.random() * 20);
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.3)`;
    ctx.fillRect(x, y, 4, 4);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(30, 30);
  
  return texture;
}

function createTrackMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: createAsphaltTexture(),
    roughness: 0.95,
    metalness: 0.1,
  });
}

function createBarrierMaterial(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: '#ff0000',
    linewidth: 3,
    transparent: true,
    opacity: 0.9,
  });
}

function createCenterLineMaterial(): THREE.LineDashedMaterial {
  return new THREE.LineDashedMaterial({
    color: '#ffffff',
    linewidth: 2,
    dashSize: TRACK_CONFIG.CENTER_LINE_DASH,
    gapSize: TRACK_CONFIG.CENTER_LINE_GAP,
    transparent: true,
    opacity: 0.6,
  });
}

// ============================================================================
// TRACK COMPONENTS
// ============================================================================

function InfinityTrack() {
  const curve = useMemo(() => new InfinityCurve(TRACK_CONFIG.SCALE), []);

  const trackGeometry = useMemo(() => 
    createFlatTrackGeometry(curve, TRACK_CONFIG.WIDTH, TRACK_CONFIG.SEGMENTS), 
    [curve]
  );

  const leftBarrierGeometry = useMemo(() => 
    createBarrierGeometry(curve, TRACK_CONFIG.BARRIER_OFFSET), 
    [curve]
  );
  
  const rightBarrierGeometry = useMemo(() => 
    createBarrierGeometry(curve, -TRACK_CONFIG.BARRIER_OFFSET), 
    [curve]
  );

  const centerLineGeometry = useMemo(() => 
    createCenterLineGeometry(curve), 
    [curve]
  );

  const trackMaterial = useMemo(() => createTrackMaterial(), []);
  const barrierMaterial = useMemo(() => createBarrierMaterial(), []);
  const centerLineMaterial = useMemo(() => createCenterLineMaterial(), []);

  // Create Three.js line objects
  const leftBarrierLine = useMemo(() => 
    new THREE.Line(leftBarrierGeometry, barrierMaterial), 
    [leftBarrierGeometry, barrierMaterial]
  );
  
  const rightBarrierLine = useMemo(() => 
    new THREE.Line(rightBarrierGeometry, barrierMaterial), 
    [rightBarrierGeometry, barrierMaterial]
  );

  const centerLine = useMemo(() => {
    const line = new THREE.Line(centerLineGeometry, centerLineMaterial);
    line.computeLineDistances();
    return line;
  }, [centerLineGeometry, centerLineMaterial]);

  useFrame(() => {
    if (centerLine && centerLine.material && 'dashOffset' in centerLine.material) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (centerLine.material as any).dashOffset -= 0.02;
    }
  });

  return (
    <group>
      {/* Main Track Surface */}
      <mesh 
        geometry={trackGeometry} 
        material={trackMaterial}
        receiveShadow
        castShadow
      />

      {/* Barriers */}
      <primitive object={leftBarrierLine} />
      <primitive object={rightBarrierLine} />

      {/* Center Line */}
      <primitive object={centerLine} />

      {/* Curbs */}
      <CurbMarkers curve={curve} />
    </group>
  );
}

// ============================================================================
// CURBS & MARKERS
// ============================================================================

function CurbMarkers({ curve }: { curve: InfinityCurve }) {
  // Create smooth continuous curbs using TubeGeometry
  const { leftCurb, rightCurb } = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    
    // Define curb path curves
    class CurbCurve extends THREE.Curve<THREE.Vector3> {
      constructor(
        private baseCurve: InfinityCurve,
        private offset: number
      ) {
        super();
      }

      getPoint(t: number): THREE.Vector3 {
        const point = this.baseCurve.getPoint(t);
        const tangent = this.baseCurve.getTangent(t);
        const perpendicular = new THREE.Vector3()
          .crossVectors(tangent, up)
          .normalize();
        
        const curbPoint = point.clone().add(
          perpendicular.clone().multiplyScalar(this.offset)
        );
        curbPoint.y += 0.08;
        
        return curbPoint;
      }
    }

    const leftCurbCurve = new CurbCurve(curve, TRACK_CONFIG.CURB_OFFSET);
    const rightCurbCurve = new CurbCurve(curve, -TRACK_CONFIG.CURB_OFFSET);

    // Create tube geometries for smooth curbs
    const leftGeometry = new THREE.TubeGeometry(leftCurbCurve, 256, 0.06, 8, true);
    const rightGeometry = new THREE.TubeGeometry(rightCurbCurve, 256, 0.06, 8, true);

    return { leftCurb: leftGeometry, rightCurb: rightGeometry };
  }, [curve]);

  // Create alternating red and white pattern material
  const curbMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.4,
      metalness: 0.2,
    });
  }, []);

  return (
    <group>
      {/* Left curb */}
      <mesh geometry={leftCurb} material={curbMaterial} castShadow />
      
      {/* Right curb */}
      <mesh geometry={rightCurb} material={curbMaterial} castShadow />
      
      {/* Add red stripe pattern on curbs */}
      {Array.from({ length: 64 }).map((_, i) => {
        const t = i / 64;
        const point = curve.getPoint(t);
        const tangent = curve.getTangent(t);
        const perpendicular = new THREE.Vector3()
          .crossVectors(tangent, new THREE.Vector3(0, 1, 0))
          .normalize();
        
        const leftPos = point.clone().add(perpendicular.clone().multiplyScalar(TRACK_CONFIG.CURB_OFFSET));
        const rightPos = point.clone().sub(perpendicular.clone().multiplyScalar(TRACK_CONFIG.CURB_OFFSET));
        
        leftPos.y += 0.08;
        rightPos.y += 0.08;
        
        const rotation = new THREE.Euler(0, Math.atan2(tangent.x, tangent.z), 0);
        const isRed = i % 2 === 0;
        
        if (!isRed) return null;
        
        return (
          <group key={i}>
            <mesh position={leftPos} rotation={rotation}>
              <boxGeometry args={[0.12, 0.02, 0.15]} />
              <meshStandardMaterial 
                color="#ff0000"
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>
            <mesh position={rightPos} rotation={rotation}>
              <boxGeometry args={[0.12, 0.02, 0.15]} />
              <meshStandardMaterial 
                color="#ff0000"
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ============================================================================
// RACING CAR COMPONENT
// ============================================================================

function RacingCar({ isPaused, trailingOffset = 0, color = "#ff3333" }: RacingCarProps) {
  const carRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<(THREE.Mesh | null)[]>([null, null, null, null]);
  const suspensionRefs = useRef<(THREE.Group | null)[]>([null, null, null, null]);
  
  const curve = useMemo(() => new InfinityCurve(TRACK_CONFIG.SCALE), []);
  
  // Initialize car position on the track
  const initialProgress = useMemo(() => (0.1 - trailingOffset + 1) % 1, [trailingOffset]); // Start at 10% minus trailing offset
  const initialPosition = useMemo(() => {
    const pos = curve.getPoint(initialProgress);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [curve, initialProgress]);
  
  // Physics state
  const progressRef = useRef(initialProgress);
  const velocityRef = useRef(CAR_PHYSICS.BASE_SPEED);
  const wheelRotationRef = useRef(0);
  
  // Smooth interpolation state - initialize with actual starting position
  const smoothPosRef = useRef(initialPosition.clone());
  const previousTangentRef = useRef(new THREE.Vector3(0, 0, 1));
  const pitchRef = useRef(0);
  const rollRef = useRef(0);
  const yawRef = useRef(0);
  
  // Initialize car position and rotation on mount
  useEffect(() => {
    if (carRef.current) {
      const startPos = curve.getPoint(initialProgress);
      const startTangent = curve.getTangent(initialProgress).normalize();
      const startYaw = Math.atan2(startTangent.x, startTangent.z);
      
      smoothPosRef.current.set(startPos.x, startPos.y, startPos.z);
      previousTangentRef.current.copy(startTangent);
      yawRef.current = startYaw;
      
      carRef.current.position.set(startPos.x, startPos.y + 0.3, startPos.z);
      carRef.current.rotation.set(0, startYaw, 0);
    }
  }, [curve, initialProgress]);

  useFrame((state, delta) => {
    if (!carRef.current || isPaused) return;

    const clampedDelta = Math.min(delta, 0.1);
    
    // === IMPROVED SPEED CONTROL WITH SMOOTHER TRANSITIONS ===
    const currentPos = curve.getPoint(progressRef.current);
    const lookAhead = 0.03;
    const nearFuture = curve.getPoint((progressRef.current + lookAhead) % 1);
    const farFuture = curve.getPoint((progressRef.current + lookAhead * 2) % 1);
    
    // Calculate curvature more accurately
    const vec1 = new THREE.Vector3().subVectors(nearFuture, currentPos);
    const vec2 = new THREE.Vector3().subVectors(farFuture, nearFuture);
    const angle = vec1.angleTo(vec2);
    const curvature = Math.min(angle / Math.PI, 1);
    
    // Calculate elevation changes for better ramp handling
    const prevPos = curve.getPoint((progressRef.current - 0.005 + 1) % 1);
    const nextPos = curve.getPoint((progressRef.current + 0.01) % 1);
    const elevationChange = nextPos.y - currentPos.y;
    const currentSlope = (currentPos.y - prevPos.y) / 0.005;
    
    // Calculate target speed with realistic ramp physics
    let targetSpeed = CAR_PHYSICS.BASE_SPEED;
    
    // Stronger elevation effect for more noticeable speed changes on ramps
    if (elevationChange > 0.01) {
      // Uphill: significant slowdown
      targetSpeed *= (1 - Math.abs(currentSlope) * 8);
    } else if (elevationChange < -0.01) {
      // Downhill: slight speedup
      targetSpeed *= (1 + Math.abs(currentSlope) * 2);
    }
    
    // Apply curvature effect (slow down in corners)
    const curveEffect = 1 - (curvature * CAR_PHYSICS.CURVATURE_PENALTY);
    targetSpeed *= curveEffect;
    
    targetSpeed = THREE.MathUtils.clamp(targetSpeed, CAR_PHYSICS.MIN_SPEED, CAR_PHYSICS.MAX_SPEED);
    
    // Adaptive velocity interpolation - slower on slopes for realistic momentum
    const onSlope = Math.abs(currentSlope) > 0.5;
    const speedLerpFactor = onSlope 
      ? clampedDelta * 0.8  // Slower speed changes on ramps
      : clampedDelta * (curvature > 0.3 ? 0.5 : 1.5);
    
    velocityRef.current = THREE.MathUtils.lerp(
      velocityRef.current, 
      targetSpeed, 
      speedLerpFactor
    );
    
    // === SMOOTH POSITION UPDATE ===
    progressRef.current = (progressRef.current + velocityRef.current) % 1;
    const position = curve.getPoint(progressRef.current);
    
    // Extra smooth position interpolation
    smoothPosRef.current.lerp(position, CAR_PHYSICS.SMOOTH_FACTOR);
    
    // === NATURAL ROTATION WITH PROGRESSIVE TURNING ===
    // Use the actual track tangent as the base direction
    const trackTangent = curve.getTangent(progressRef.current).normalize();
    
    // Calculate yaw directly from track tangent for precise alignment
    const targetYaw = Math.atan2(trackTangent.x, trackTangent.z);
    
    // Handle angle wrapping for smooth rotation across 0/2π boundary
    let yawDiff = targetYaw - yawRef.current;
    if (yawDiff > Math.PI) yawDiff -= 2 * Math.PI;
    if (yawDiff < -Math.PI) yawDiff += 2 * Math.PI;
    
    // Direct yaw alignment - car points exactly to track tangent
    yawRef.current = targetYaw;
    
    // Store tangent for roll calculation
    previousTangentRef.current.copy(trackTangent);
    
    // === NATURAL PITCH (NOSE UP/DOWN) WITH ANTICIPATION ===
    // Use immediate look-ahead for instant pitch response
    const pitchLookAhead1 = curve.getPoint((progressRef.current + 0.005) % 1);
    const pitchLookAhead2 = curve.getPoint((progressRef.current + 0.01) % 1);
    const currentY = smoothPosRef.current.y;
    
    // Calculate slope with immediate response
    const slope1 = (pitchLookAhead1.y - currentY) / 0.005;
    const slope2 = (pitchLookAhead2.y - pitchLookAhead1.y) / 0.005;
    const avgSlope = (slope1 + slope2) / 2;
    
    // Calculate pitch angle from slope with very sharp response
    const slopeAngle = Math.atan(avgSlope);
    const targetPitch = -slopeAngle * 0.8; // Even sharper pitch response
    
    // Very fast pitch interpolation - nearly instant
    const slopeMagnitude = Math.abs(avgSlope);
    const pitchLerpFactor = THREE.MathUtils.clamp(
      clampedDelta * (10 + slopeMagnitude * 15), // Much faster - nearly instant response
      0,
      0.7 // Very high max lerp factor for near-instant pitch changes
    );
      
    pitchRef.current = THREE.MathUtils.lerp(
      pitchRef.current, 
      THREE.MathUtils.clamp(targetPitch, -0.55, 0.55), // Slightly increased max pitch angle
      pitchLerpFactor
    );
    
    // === NATURAL ROLL (BANKING IN TURNS) ===
    // Calculate roll from curvature (rate of direction change)
    const nextTangent = curve.getTangent((progressRef.current + 0.005) % 1).normalize();
    const curvatureDiff = Math.atan2(
      trackTangent.x * nextTangent.z - trackTangent.z * nextTangent.x,
      trackTangent.x * nextTangent.x + trackTangent.z * nextTangent.z
    );
    const turnDirection = Math.sign(curvatureDiff);
    const rollIntensity = Math.abs(curvatureDiff) * 15; // Higher multiplier for sharper banking
    const speedFactor = velocityRef.current / CAR_PHYSICS.BASE_SPEED;
    const targetRoll = turnDirection * rollIntensity * speedFactor * 0.08;
    
    rollRef.current = THREE.MathUtils.lerp(
      rollRef.current, 
      THREE.MathUtils.clamp(targetRoll, -0.12, 0.12),
      clampedDelta * 2.5
    );
    
    // === APPLY TRANSFORMATIONS ===
    // Gentle suspension oscillation based on speed
    const suspensionFreq = 18 * (velocityRef.current / CAR_PHYSICS.BASE_SPEED);
    const suspensionOffset = Math.sin(state.clock.elapsedTime * suspensionFreq) * 0.012;
    
    // Add weight transfer effect on ramps
    const weightTransfer = Math.abs(currentSlope) > 0.3 
      ? -pitchRef.current * 0.08  // Car compresses/extends based on slope
      : 0;
    
    carRef.current.position.copy(smoothPosRef.current);
    carRef.current.position.y += 0.3 + suspensionOffset + weightTransfer;
    carRef.current.rotation.set(pitchRef.current, yawRef.current, rollRef.current);
    
    // === WHEEL ROTATION ===
    const wheelSpeed = velocityRef.current * CAR_PHYSICS.WHEEL_ROTATION_SPEED;
    wheelRotationRef.current += wheelSpeed;
    wheelRefs.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x = wheelRotationRef.current;
      }
    });
    
    // === SUSPENSION ANIMATION ===
    suspensionRefs.current.forEach((suspension, idx) => {
      if (suspension) {
        const baseOffset = Math.sin(state.clock.elapsedTime * suspensionFreq + idx * Math.PI / 2) * 0.015;
        const bumpOffset = Math.sin(progressRef.current * 50 + idx) * 0.008;
        
        // Add weight transfer - front wheels compress going uphill, rear compress going downhill
        const isFrontWheel = idx < 2;
        const rampTransfer = Math.abs(currentSlope) > 0.3
          ? (currentSlope > 0 
              ? (isFrontWheel ? -0.02 : 0.01)  // Uphill: front compresses
              : (isFrontWheel ? 0.01 : -0.02)) // Downhill: rear compresses
          : 0;
        
        suspension.position.y = baseOffset + bumpOffset + rampTransfer;
      }
    });
    
  });

  return (
    <group ref={carRef}>
      {/* Main Chassis */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.8]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.05}
          metalness={0.98}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Engine Cover */}
      <mesh castShadow position={[0, 0.08, -0.15]}>
        <boxGeometry args={[0.3, 0.08, 0.4]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.05}
          metalness={0.98}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Nose Cone */}
      <mesh castShadow position={[0, -0.02, 0.45]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.05}
          metalness={0.98}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
      
      {/* Front Wing with endplates */}
      <group position={[0, -0.06, 0.42]}>
        {/* Main wing plane */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.02, 0.1]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        {/* Left endplate */}
        <mesh castShadow position={[-0.25, 0.01, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.02, 0.08, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.05} metalness={0.98} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        {/* Right endplate */}
        <mesh castShadow position={[0.25, 0.01, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.02, 0.08, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.05} metalness={0.98} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>
      
      {/* Rear Wing with supports and endplates */}
      <group position={[0, 0.15, -0.48]}>
        {/* Main wing plane */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.02, 0.1]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        {/* Supports */}
        <mesh position={[-0.15, -0.1, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0.15, -0.1, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Left endplate */}
        <mesh position={[-0.275, 0.03, 0]}>
          <boxGeometry args={[0.015, 0.14, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.05} metalness={0.98} emissive={color} emissiveIntensity={0.15} />
        </mesh>
        {/* Right endplate */}
        <mesh position={[0.275, 0.03, 0]}>
          <boxGeometry args={[0.015, 0.14, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.05} metalness={0.98} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      </group>
      
      {/* Side Pods */}
      <mesh castShadow position={[-0.22, -0.03, 0.1]}>
        <boxGeometry args={[0.08, 0.1, 0.5]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.05}
          metalness={0.98}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh castShadow position={[0.22, -0.03, 0.1]}>
        <boxGeometry args={[0.08, 0.1, 0.5]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.05}
          metalness={0.98}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Diffuser */}
      <mesh position={[0, -0.08, -0.42]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.35, 0.02, 0.18]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      
      {/* Exhaust pipes */}
      <mesh position={[-0.08, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.9}
          emissive="#ff6600"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.08, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.9}
          emissive="#ff6600"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Headlights */}
      <pointLight position={[0, 0, 0.5]} color="#ffffff" intensity={1.8} distance={2.5} />
      <mesh position={[-0.1, -0.02, 0.48]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh position={[0.1, -0.02, 0.48]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
        />
      </mesh>
      
      {/* Rear lights */}
      <mesh position={[-0.12, 0.02, -0.48]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial 
          color="#ff3333"
          emissive="#ff3333"
          emissiveIntensity={1.0}
        />
      </mesh>
      <mesh position={[0.12, 0.02, -0.48]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial 
          color="#ff3333"
          emissive="#ff3333"
          emissiveIntensity={1.0}
        />
      </mesh>
      
      {/* Cockpit */}
      <group position={[0, 0.08, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.15, 0.4]} />
          <meshStandardMaterial 
            color="#1e3a8a"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </group>
      
      {/* Helmet */}
      <mesh position={[0, 0.22, 0.05]} castShadow>
        <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#fbbf24"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Simple Wheels */}
      {[
        [-0.22, -0.1, 0.32],
        [0.22, -0.1, 0.32],
        [-0.22, -0.1, -0.32],
        [0.22, -0.1, -0.32]
      ].map((pos, idx) => (
        <group 
          key={idx} 
          ref={(el) => (suspensionRefs.current[idx] = el)}
          position={pos as [number, number, number]}
        >
          {/* Tire */}
          <mesh
            ref={(el) => (wheelRefs.current[idx] = el)}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
            <meshStandardMaterial 
              color="#1a1a1a"
              roughness={0.95}
              metalness={0.05}
            />
          </mesh>
          
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.11, 16]} />
            <meshStandardMaterial 
              color="#c0c0c0"
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// SECTOR MARKER COMPONENT
// ============================================================================

function SectorMarker({ sector, onClick, isActive }: SectorMarkerProps) {
  const markerRef = useRef<THREE.Group>(null);
  const curve = useMemo(() => new InfinityCurve(TRACK_CONFIG.SCALE), []);
  const Icon = sector.icon;

  const position = curve.getPoint(sector.position);
  // Add offset relative to track height (markers float 2.0 units above track surface)
  const offset = new THREE.Vector3(0, 2.0, 0);
  position.add(offset);

  useFrame((state) => {
    if (markerRef.current && !isActive) {
      markerRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2 + sector.position * 10) * 0.15;
    }
  });

  return (
    <group ref={markerRef} position={position}>
      <Html center distanceFactor={10}>
        <motion.button
          className="sector-marker-3d"
          aria-label={sector.name}
          aria-haspopup="dialog"
          aria-controls="skill-details"
          style={{
            '--sector-color': sector.color
          } as React.CSSProperties}
          onClick={onClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="marker-glow-3d" />
          <div className="marker-shine" />
          <div 
            className="marker-icon-3d"
            style={{ color: isActive ? '#ffffff' : sector.color }}
          >
            <div className="marker-icon-wrapper">
              <Icon className="marker-icon-svg" />
            </div>
          </div>
          <div 
            className="marker-label-3d" 
            style={{ color: isActive ? '#ffffff' : '#cbd5e1' }}
          >
            {sector.name.split(' ')[0]}
          </div>
        </motion.button>
      </Html>
    </group>
  );
}

// ============================================================================
// 3D SCENE COMPONENT
// ============================================================================

interface Scene3DProps {
  isPaused: boolean;
  selectedSector: Sector | null;
  onSectorClick: (sector: Sector) => void;
  sectors: Sector[];
  lowPower: boolean;
}

function Scene3D({ isPaused, selectedSector, onSectorClick, sectors, lowPower }: Scene3DProps) {
  // Drei Html creates its own DOM root. Mount it only after Fiber connects its
  // events, so the initial target cannot change and race the old root's cleanup.
  const eventsConnected = useThree(state => Boolean(state.events.connected));
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={LIGHTING_CONFIG.AMBIENT_INTENSITY} />
      <directionalLight
        position={LIGHTING_CONFIG.DIRECTIONAL_POSITION}
        intensity={LIGHTING_CONFIG.DIRECTIONAL_INTENSITY}
        castShadow={!lowPower}
        shadow-mapSize-width={lowPower ? 512 : 1024}
        shadow-mapSize-height={lowPower ? 512 : 1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Track */}
      <InfinityTrack />

      {/* Racing Cars */}
      <RacingCar isPaused={isPaused} color="#ff3333" />
      <RacingCar isPaused={isPaused} trailingOffset={0.9} color="#00aaff" />

      {/* Sector Markers - Hide when modal is open */}
      {eventsConnected && !selectedSector && sectors.map((sector) => (
        <SectorMarker
          key={sector.id}
          sector={sector}
          onClick={() => onSectorClick(sector)}
          isActive={false}
        />
      ))}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={!isPaused}
        autoRotateSpeed={CAMERA_CONFIG.AUTO_ROTATE_SPEED}
        minDistance={CAMERA_CONFIG.MIN_DISTANCE}
        maxDistance={CAMERA_CONFIG.MAX_DISTANCE}
        maxPolarAngle={CAMERA_CONFIG.MAX_POLAR_ANGLE}
      />

      {/* Atmospheric Effects */}
      <Sparkles
        count={lowPower ? 20 : 80}
        scale={25}
        size={2.5}
        speed={0.3}
        opacity={0.4}
        color="#ffffff"
      />

      {/* Starfield Background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={lowPower ? 500 : 3000}
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
    </>
  );
}

function WebGLContextObserver({ onContextLost }: { onContextLost: () => void }) {
  const canvas = useThree(state => state.gl.domElement);
  useEffect(() => {
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener('webglcontextlost', handleLoss);
    return () => canvas.removeEventListener('webglcontextlost', handleLoss);
  }, [canvas, onContextLost]);
  return null;
}


interface SkillsTrack3DProps extends Scene3DProps {
  sceneActive: boolean;
  reducedMotion: boolean;
  onContextLost: () => void;
}

export default function SkillsTrack3D({
  isPaused, selectedSector, onSectorClick, sectors, lowPower,
  sceneActive, reducedMotion, onContextLost,
}: SkillsTrack3DProps) {
  return <>
              <Canvas
                  camera={{
                      position: CAMERA_CONFIG.POSITION,
                      fov: CAMERA_CONFIG.FOV,
                  }}
                  dpr={lowPower ? 1 : [1, 1.5]}
                  shadows={!lowPower}
                  frameloop={!sceneActive || selectedSector ? 'never' : reducedMotion ? 'demand' : 'always'}
                  gl={(defaults) => {
                    // Check the real canvas too: a successful probe does not
                    // guarantee a later context allocation will succeed.
                    const canvas = defaults.canvas as HTMLCanvasElement;
                    const options = { alpha: true, antialias: !lowPower, powerPreference: 'default' as const };
                    const context = canvas.getContext('webgl2', options) as WebGL2RenderingContext | null;
                    if (!context) throw new Error('3D graphics are unavailable.');
                    return new THREE.WebGLRenderer({ ...defaults, ...options, context });
                  }}
                  onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.3;
                  }}
              >
                  <WebGLContextObserver onContextLost={onContextLost} />
                  <color attach="background" args={["#0a0a1a"]} />
                  <Scene3D
                      isPaused={isPaused}
                      selectedSector={selectedSector}
                      onSectorClick={onSectorClick}
                      sectors={sectors}
                      lowPower={lowPower}
                  />
              </Canvas>
          <style jsx global>{`
              .sector-marker-3d {
                  position: relative;
                  width: 75px;
                  height: 75px;
                  background: rgba(15, 23, 42, 0.95);
                  border: 3px solid var(--sector-color);
                  border-radius: 18px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  gap: 6px;
                  cursor: pointer;
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  backdrop-filter: blur(12px);
                  overflow: hidden;
              }

              .sector-marker-3d:hover {
                  background: var(--sector-color);
                  transform: scale(1.1) translateY(-5px);
                  box-shadow: 0 10px 40px var(--sector-color);
              }

              .marker-glow-3d {
                  position: absolute;
                  inset: -10px;
                  background: radial-gradient(
                      circle,
                      var(--sector-color) 0%,
                      transparent 70%
                  );
                  opacity: 0.5;
                  filter: blur(15px);
                  pointer-events: none;
                  animation: pulse-glow 2s ease-in-out infinite;
              }

              .marker-shine {
                  position: absolute;
                  top: -50%;
                  left: -50%;
                  width: 200%;
                  height: 200%;
                  background: linear-gradient(
                      45deg,
                      transparent 30%,
                      rgba(255, 255, 255, 0.1) 50%,
                      transparent 70%
                  );
                  animation: shine 3s infinite;
                  pointer-events: none;
              }

              @keyframes shine {
                  0% {
                      transform: translateX(-100%) translateY(-100%)
                          rotate(45deg);
                  }
                  100% {
                      transform: translateX(100%) translateY(100%) rotate(45deg);
                  }
              }

              @keyframes pulse-glow {
                  0%,
                  100% {
                      opacity: 0.5;
                      transform: scale(1);
                  }
                  50% {
                      opacity: 0.8;
                      transform: scale(1.1);
                  }
              }

              .marker-icon-3d {
                  width: 48px;
                  height: 48px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                  transition: all 0.3s;
                  filter: drop-shadow(0 0 8px currentColor);
              }

              .marker-icon-wrapper {
                  width: 28px;
                  height: 28px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
              }

              .marker-icon-3d svg,
              .marker-icon-svg,
              .marker-icon-wrapper svg {
                  width: 28px !important;
                  height: 28px !important;
                  min-width: 28px !important;
                  min-height: 28px !important;
                  max-width: 28px !important;
                  max-height: 28px !important;
                  flex-shrink: 0;
                  stroke-width: 2.5;
                  display: block;
                  box-sizing: border-box;
              }

              .marker-icon-wrapper svg {
                  viewbox: attr(viewBox);
              }

              .marker-label-3d {
                  font-size: 10px;
                  font-weight: 700;
                  text-align: center;
                  line-height: 1.1;
                  transition: color 0.3s;
                  text-shadow: 0 0 10px currentColor;
              }
          `}</style>
  </>;
}
