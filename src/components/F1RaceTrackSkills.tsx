'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
    Server,
    Cloud,
    Database,
    GitBranch,
    Activity,
    X,
    Code,
    Brain,
    Lock,
    Gauge,
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SkillWithIcon {
  name: string;
  icon: string; // Can be image path or Font Awesome icon class
  faIcon?: string; // Optional Font Awesome icon class as fallback
}

interface Sector {
  id: string;
  name: string;
  position: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  skills: SkillWithIcon[];
  description: string;
}

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


// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

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
  BASE_SPEED: 0.003,
  MAX_SPEED: 0.006,
  MIN_SPEED: 0.002,
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

// This will be created inside the component to access translations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSectors(t: any): Sector[] {
  return [
    {
      id: 'programming',
      name: t.skills.sectors.programming.name,
      position: 0.08,
      icon: Code,
      color: '#3b82f6',
      skills: [
        { name: 'Python', icon: '/skills/programming/Python.png' },
        { name: 'JavaScript', icon: '/skills/programming/JavaScript.png' },
        { name: 'TypeScript', icon: '/skills/programming/TypeScript.png' },
        { name: 'Go', icon: '/skills/programming/GoLang.png' },
      ],
      description: t.skills.sectors.programming.description
    },
    {
      id: 'web',
      name: t.skills.sectors.web.name,
      position: 0.20,
      icon: Server,
      color: '#10b981',
      skills: [
        { name: 'React.js', icon: '/skills/web/React.png', faIcon: 'fab fa-react' },
        { name: 'Next.js', icon: '/skills/web/NextJs.png', faIcon: 'fas fa-arrow-right' },
        { name: 'Express.js', icon: '/skills/web/Express.png', faIcon: 'fas fa-server' },
        { name: 'Tailwind CSS', icon: '/skills/web/TailwindCSS.png', faIcon: 'fas fa-wind' },
      ],
      description: t.skills.sectors.web.description
    },
    {
      id: 'cloud',
      name: t.skills.sectors.cloud.name,
      position: 0.32,
      icon: Cloud,
      color: '#f59e0b',
      skills: [
        { name: 'AWS', icon: '/skills/cloud/AWS.png', faIcon: 'fab fa-aws' },
        { name: 'Azure', icon: '/skills/cloud/Azure.png', faIcon: 'fas fa-cloud' },
        { name: 'GCP', icon: '/skills/cloud/GCP.png', faIcon: 'fas fa-cloud-meatball' },
        { name: 'Alibaba Cloud', icon: '/skills/cloud/AlibabaCloud.png', faIcon: 'fas fa-cloud-upload-alt' },
        { name: 'Vercel', icon: '/skills/cloud/Vercel.png', faIcon: 'fas fa-bolt' },
        { name: 'Netlify', icon: '/skills/cloud/Netlify.png', faIcon: 'fas fa-globe' },
      ],
      description: t.skills.sectors.cloud.description
    },
    {
      id: 'devops',
      name: t.skills.sectors.devops.name,
      position: 0.44,
      icon: GitBranch,
      color: '#8b5cf6',
      skills: [
        { name: 'Kubernetes', icon: '/skills/devops/Kubernetes.png', faIcon: 'fas fa-dharmachakra' },
        { name: 'Docker', icon: '/skills/devops/Docker.png', faIcon: 'fab fa-docker' },
        { name: 'Terraform', icon: '/skills/devops/Terraform.png', faIcon: 'fas fa-server' },
        { name: 'Ansible', icon: '/skills/devops/Ansible.png', faIcon: 'fas fa-robot' },
        { name: 'GitHub Actions', icon: '/skills/devops/GitHubActions.png', faIcon: 'fab fa-github-alt' },
        { name: 'Argo CD', icon: '/skills/devops/ArgoCD.png', faIcon: 'fas fa-ship' },
      ],
      description: t.skills.sectors.devops.description
    },
    {
      id: 'monitoring',
      name: t.skills.sectors.monitoring.name,
      position: 0.56,
      icon: Activity,
      color: '#ec4899',
      skills: [
        { name: 'Prometheus', icon: '/skills/monitoring/Prometheus.png', faIcon: 'fas fa-chart-line' },
        { name: 'Grafana', icon: '/skills/monitoring/Grafana.png', faIcon: 'fas fa-chart-bar' },
        { name: 'Loki', icon: '/skills/monitoring/Loki.png', faIcon: 'fas fa-database' },
        { name: 'Mimir', icon: '/skills/monitoring/Mimir.png', faIcon: 'fas fa-database' },
        { name: 'OTel', icon: '/skills/monitoring/OTel.png', faIcon: 'fas fa-project-diagram' },
        { name: 'Fluent Bit', icon: '/skills/monitoring/FluentBit.png', faIcon: 'fas fa-stream' },
      ],
      description: t.skills.sectors.monitoring.description
    },
    {
      id: 'database',
      name: t.skills.sectors.database.name,
      position: 0.68,
      icon: Database,
      color: '#10b981',
      skills: [
        { name: 'PostgreSQL', icon: '/skills/databases/Postgresql.png' },
        { name: 'MongoDB', icon: '/skills/databases/MongoDB.png' },
      ],
      description: t.skills.sectors.database.description
    },
    {
      id: 'ai',
      name: t.skills.sectors.ai.name,
      position: 0.80,
      icon: Brain,
      color: '#a855f7',
      skills: [
        { name: 'LLM APIs', icon: '/skills/ai/LLM.png', faIcon: 'fas fa-robot' },
        { name: 'Hugging Face', icon: '/skills/ai/HuggingFace.png', faIcon: 'fas fa-hands-helping' },
        { name: 'PyTorch', icon: '/skills/data/PyTorch.png', faIcon: 'fab fa-python' },
        { name: 'TensorFlow', icon: '/skills/data/TensorFlow.png', faIcon: 'fas fa-brain' },
        { name: 'Pandas', icon: '/skills/data/Pandas.png', faIcon: 'fas fa-table' },
        { name: 'NumPy', icon: '/skills/data/NumPy.png', faIcon: 'fas fa-calculator' },
        { name: 'Scikit-Learn', icon: '/skills/data/ScikitLearn.png', faIcon: 'fas fa-cogs' },
        { name: 'Matplotlib', icon: '/skills/data/Matplotlib.png', faIcon: 'fas fa-chart-bar' },
        { name: 'Seaborn', icon: '/skills/data/Seaborn.png', faIcon: 'fas fa-palette' },
        { name: 'Plotly', icon: '/skills/data/Plotly.png', faIcon: 'fas fa-chart-line' },
      ],
      description: t.skills.sectors.ai.description
    },
    {
      id: 'security',
      name: t.skills.sectors.security.name,
      position: 0.92,
      icon: Lock,
      color: '#ef4444',
      skills: [
        { name: 'Penetration Testing', icon: '/skills/security/Pentest.png', faIcon: 'fas fa-user-secret' },
        { name: 'SIEM', icon: '/skills/security/SIEM.png', faIcon: 'fas fa-shield-alt' },
        { name: 'Incident Response', icon: '/skills/security/IncidentResponse.png', faIcon: 'fas fa-exclamation-triangle' },
        { name: 'Digital Forensics', icon: '/skills/security/Forensics.png', faIcon: 'fas fa-search' },
      ],
      description: t.skills.sectors.security.description
    },
  ];
}

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
    
    // Faster tangent interpolation for sharper turning
    const tangentLerpFactor = THREE.MathUtils.clamp(clampedDelta * 4, 0, 0.3);
    const smoothTangent = new THREE.Vector3()
      .lerpVectors(previousTangentRef.current, trackTangent, tangentLerpFactor)
      .normalize();
    previousTangentRef.current.copy(smoothTangent);
    
    // Calculate target yaw from smooth tangent
    const targetYaw = Math.atan2(smoothTangent.x, smoothTangent.z);
    
    // Handle angle wrapping for smooth rotation across 0/2π boundary
    let yawDiff = targetYaw - yawRef.current;
    if (yawDiff > Math.PI) yawDiff -= 2 * Math.PI;
    if (yawDiff < -Math.PI) yawDiff += 2 * Math.PI;
    
    // Sharper yaw interpolation - faster response to turns
    const turnIntensity = Math.abs(yawDiff);
    const yawLerpFactor = THREE.MathUtils.clamp(
      clampedDelta * (4 + turnIntensity * 6), // Much faster in sharp turns
      0,
      0.4
    );
      
    yawRef.current += yawDiff * yawLerpFactor;
    
    // === NATURAL PITCH (NOSE UP/DOWN) WITH ANTICIPATION ===
    // Use multiple look-ahead points for smoother pitch prediction
    const pitchLookAhead1 = curve.getPoint((progressRef.current + 0.015) % 1);
    const pitchLookAhead2 = curve.getPoint((progressRef.current + 0.03) % 1);
    const currentY = smoothPosRef.current.y;
    
    // Calculate average slope from multiple points for smoother transitions
    const slope1 = (pitchLookAhead1.y - currentY) / 0.015;
    const slope2 = (pitchLookAhead2.y - pitchLookAhead1.y) / 0.015;
    const avgSlope = (slope1 + slope2) / 2;
    
    // Calculate pitch angle from slope with more natural response
    const slopeAngle = Math.atan(avgSlope);
    const targetPitch = -slopeAngle * 0.4; // More natural pitch response
    
    // Adaptive pitch interpolation - smoother on gentle slopes, responsive on steep ones
    const slopeMagnitude = Math.abs(avgSlope);
    const pitchLerpFactor = THREE.MathUtils.clamp(
      clampedDelta * (1.5 + slopeMagnitude * 2), // Faster on steeper slopes
      0,
      0.15
    );
      
    pitchRef.current = THREE.MathUtils.lerp(
      pitchRef.current, 
      THREE.MathUtils.clamp(targetPitch, -0.35, 0.35), // Slightly reduced max pitch
      pitchLerpFactor
    );
    
    // === NATURAL ROLL (BANKING IN TURNS) ===
    // Calculate roll from turn direction and speed
    const turnDirection = Math.sign(yawDiff);
    const rollIntensity = Math.abs(yawDiff) * 5;
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
          roughness={0.15}
          metalness={0.95}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Engine Cover */}
      <mesh castShadow position={[0, 0.08, -0.15]}>
        <boxGeometry args={[0.3, 0.08, 0.4]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.15}
          metalness={0.95}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Nose Cone */}
      <mesh castShadow position={[0, -0.02, 0.45]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.15}
          metalness={0.95}
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
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        {/* Right endplate */}
        <mesh castShadow position={[0.25, 0.01, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.02, 0.08, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} emissive={color} emissiveIntensity={0.2} />
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
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} emissive={color} emissiveIntensity={0.15} />
        </mesh>
        {/* Right endplate */}
        <mesh position={[0.275, 0.03, 0]}>
          <boxGeometry args={[0.015, 0.14, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      </group>
      
      {/* Side Pods */}
      <mesh castShadow position={[-0.22, -0.03, 0.1]}>
        <boxGeometry args={[0.08, 0.1, 0.5]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.2}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh castShadow position={[0.22, -0.03, 0.1]}>
        <boxGeometry args={[0.08, 0.1, 0.5]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.2}
          metalness={0.9}
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
}

function Scene3D({ isPaused, selectedSector, onSectorClick, sectors }: Scene3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={LIGHTING_CONFIG.AMBIENT_INTENSITY} />
      <directionalLight
        position={LIGHTING_CONFIG.DIRECTIONAL_POSITION}
        intensity={LIGHTING_CONFIG.DIRECTIONAL_INTENSITY}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
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
      <RacingCar isPaused={isPaused} trailingOffset={0.08} color="#00aaff" />

      {/* Sector Markers - Hide when modal is open */}
      {!selectedSector && sectors.map((sector) => (
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
        count={80}
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
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
    </>
  );
}

// ============================================================================
// SKILL ICON COMPONENT (Handles images and Font Awesome icons)
// ============================================================================

interface SkillIconProps {
  skill: SkillWithIcon;
  size?: number;
  className?: string;
}

function SkillIcon({ skill, size = 40, className = "" }: SkillIconProps) {
  const [imageError, setImageError] = React.useState(false);
  const [isFontAwesome, setIsFontAwesome] = React.useState(false);

  // Check if icon is a Font Awesome class (starts with fab:, fas:, far:, etc.)
  // Only set this if it's NOT an image path
  React.useEffect(() => {
    if (!skill.icon.startsWith('/')) {
      if (skill.icon.startsWith('fab:') || skill.icon.startsWith('fas:') || 
          skill.icon.startsWith('far:') || skill.icon.startsWith('fal:') ||
          skill.icon.startsWith('fab fa-') || skill.icon.startsWith('fas fa-') ||
          skill.icon.startsWith('far fa-') || skill.icon.startsWith('fal fa-')) {
        setIsFontAwesome(true);
      }
    }
  }, [skill.icon]);

  // Container style for consistent sizing
  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    margin: '4px',
    padding: '2px',
  };

  // If image failed to load, use Font Awesome icon as fallback
  if (imageError) {
    const faClass = skill.faIcon || getDefaultFAIcon(skill.name);
    return (
      <div style={containerStyle}>
        <i 
          className={`${faClass} text-slate-200`}
          style={{ fontSize: `${size * 0.75}px`, lineHeight: 1 }}
        />
      </div>
    );
  }

  // If it's a Font Awesome icon (not an image path), use it directly
  if (isFontAwesome) {
    let faClass: string;
    // Parse Font Awesome format: "fab:react" -> "fab fa-react"
    const match = skill.icon.match(/^(fab|fas|far|fal):(.+)$/);
    if (match) {
      const [, prefix, iconName] = match;
      faClass = `${prefix} fa-${iconName}`;
    } else {
      faClass = skill.icon; // Already a valid FA class
    }
    
    return (
      <div style={containerStyle}>
        <i 
          className={`${faClass} text-slate-200`}
          style={{ fontSize: `${size * 0.75}px`, lineHeight: 1 }}
        />
      </div>
    );
  }

  // Priority: Try to load image first (if it's an image path)
  // Image paths typically start with '/' or are relative paths
  if (skill.icon.startsWith('/') || skill.icon.includes('.')) {
    return (
      <div style={containerStyle}>
        <Image 
          src={skill.icon} 
          alt={skill.name}
          width={size}
          height={size}
          className={`object-contain ${className}`}
          style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Final fallback: use Font Awesome icon
  const faClass = skill.faIcon || getDefaultFAIcon(skill.name);
  return (
    <div style={containerStyle}>
      <i 
        className={`${faClass} text-slate-200`}
        style={{ fontSize: `${size * 0.75}px`, lineHeight: 1 }}
      />
    </div>
  );
}

// Helper function to get default Font Awesome icons for common skills
function getDefaultFAIcon(skillName: string): string {
  const iconMap: Record<string, string> = {
    'Python': 'fab fa-python',
    'JavaScript': 'fab fa-js-square',
    'TypeScript': 'fab fa-js-square',
    'Go': 'fab fa-golang',
    'Node.js': 'fab fa-node-js',
    'React.js': 'fab fa-react',
    'Next.js': 'fas fa-arrow-right',
    'Express.js': 'fas fa-server',
    'Tailwind CSS': 'fas fa-wind',
    'MERN Stack': 'fab fa-react',
    'AWS': 'fab fa-aws',
    'Azure': 'fas fa-cloud',
    'GCP': 'fas fa-cloud-meatball',
    'Alibaba Cloud': 'fas fa-cloud-upload-alt',
    'Kubernetes': 'fas fa-dharmachakra',
    'Docker': 'fab fa-docker',
    'Terraform': 'fas fa-server',
    'Ansible': 'fas fa-robot',
    'GitHub Actions': 'fab fa-github-alt',
    'Argo CD': 'fas fa-ship',
    'Prometheus': 'fas fa-chart-line',
    'Grafana': 'fas fa-chart-bar',
    'Loki & Mimir': 'fas fa-database',
    'OTel': 'fas fa-project-diagram',
    'PostgreSQL': 'fas fa-elephant',
    'MongoDB': 'fas fa-leaf',
    'LLM APIs': 'fas fa-robot',
    'Hugging Face': 'fas fa-hands-helping',
    'PyTorch': 'fab fa-python',
    'TensorFlow': 'fas fa-brain',
    'Pandas': 'fas fa-table',
    'Penetration Testing': 'fas fa-user-secret',
    'SIEM': 'fas fa-shield-alt',
    'Incident Response': 'fas fa-exclamation-triangle',
    'Digital Forensics': 'fas fa-search',
  };

  return iconMap[skillName] || 'fas fa-code';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function F1RaceTrackSkills() {
  const { t } = useLanguage();
  const sectors = useMemo(() => getSectors(t), [t]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector);
    setIsPaused(true);
  };

  const handleClose = () => {
    setSelectedSector(null);
    setIsPaused(false);
  };

  // Add keyboard support for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSector) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSector]);

  return (
      <section className="min-h-screen py-16 px-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <motion.div
              className="text-center mb-8 relative z-10"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
          >
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3">
                  <Gauge className="w-12 h-12 text-yellow-400" />
                  {t.skills.title}
              </h2>
              <p className="text-xl text-slate-300 mb-2 font-semibold">
                  {t.skills.subtitle}
              </p>
              <p className="text-sm text-slate-400 font-mono">
                  {t.skills.instructions}
              </p>
          </motion.div>

          <motion.div
              className="relative w-full h-[650px] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-600"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                  background:
                      "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
                  boxShadow:
                      "0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5)",
              }}
          >
              <Canvas
                  camera={{
                      position: CAMERA_CONFIG.POSITION,
                      fov: CAMERA_CONFIG.FOV,
                  }}
                  shadows
                  gl={{
                      antialias: true,
                      toneMapping: THREE.ACESFilmicToneMapping,
                      toneMappingExposure: 1.3,
                  }}
              >
                  <color attach="background" args={["#0a0a1a"]} />
                  <Scene3D
                      isPaused={isPaused}
                      selectedSector={selectedSector}
                      onSectorClick={handleSectorClick}
                      sectors={sectors}
                  />
              </Canvas>
          </motion.div>

          {/* Sector Details Modal - Enhanced UI/UX */}
          <AnimatePresence mode="wait">
              {selectedSector && (
                  <motion.div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleClose}
                  >
                      {/* Animated background with blur */}
                      <motion.div
                          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                          initial={{ backdropFilter: "blur(0px)" }}
                          animate={{ backdropFilter: "blur(12px)" }}
                          exit={{ backdropFilter: "blur(0px)" }}
                      />

                      {/* Glow effect */}
                      <motion.div
                          className="absolute inset-0 opacity-30"
                          style={{
                              background: `radial-gradient(circle at center, ${selectedSector.color}40 0%, transparent 70%)`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 0.3 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                      />

                      <motion.div
                          className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl"
                          style={{
                              background:
                                  "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
                              border: `2px solid ${selectedSector.color}`,
                              boxShadow: `0 0 80px ${selectedSector.color}60, inset 0 0 80px rgba(0,0,0,0.3)`,
                          }}
                          initial={{
                              opacity: 0,
                              scale: 0.8,
                              rotateX: -15,
                              y: 50,
                          }}
                          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotateX: 15, y: -50 }}
                          transition={{
                              type: "spring",
                              damping: 25,
                              stiffness: 300,
                          }}
                          onClick={(e) => e.stopPropagation()}
                      >
                          {/* Header with gradient background */}
                          <div
                              className="relative p-8 overflow-hidden"
                              style={{
                                  background: `linear-gradient(135deg, ${selectedSector.color}20 0%, transparent 100%)`,
                              }}
                          >
                              {/* Animated particles in header */}
                              <div className="absolute inset-0 opacity-20">
                                  {[...Array(20)].map((_, i) => (
                                      <motion.div
                                          key={i}
                                          className="absolute w-1 h-1 rounded-full"
                                          style={{
                                              backgroundColor:
                                                  selectedSector.color,
                                              left: `${Math.random() * 100}%`,
                                              top: `${Math.random() * 100}%`,
                                          }}
                                          animate={{
                                              y: [0, -20, 0],
                                              opacity: [0, 1, 0],
                                          }}
                                          transition={{
                                              duration: 2 + Math.random() * 2,
                                              repeat: Infinity,
                                              delay: Math.random() * 2,
                                          }}
                                      />
                                  ))}
                              </div>

                              <button
                                  onClick={handleClose}
                                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm transition-all hover:scale-110 hover:rotate-90 duration-300 group"
                              >
                                  <X className="w-5 h-5 text-slate-300 group-hover:text-white" />
                              </button>

                              <div className="flex items-center gap-6 relative z-10">
                                  <motion.div
                                      className="w-20 h-20 flex-shrink-0 rounded-2xl flex items-center justify-center relative"
                                      style={{
                                          backgroundColor: `${selectedSector.color}20`,
                                          boxShadow: `0 0 30px ${selectedSector.color}40`,
                                      }}
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{
                                          type: "spring",
                                          delay: 0.2,
                                      }}
                                  >
                                      <div
                                          className="absolute inset-0 rounded-2xl"
                                          style={{
                                              background: `linear-gradient(135deg, ${selectedSector.color}40, transparent)`,
                                          }}
                                      />
                                      <div
                                          style={{
                                              color: selectedSector.color,
                                          }}
                                      >
                                          {React.createElement(
                                              selectedSector.icon,
                                              {
                                                  className:
                                                      "w-12 h-12 relative z-10",
                                              }
                                          )}
                                      </div>
                                  </motion.div>

                                  <div className="flex-1">
                                      <motion.h3
                                          className="text-4xl font-black text-white mb-2 tracking-tight"
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.3 }}
                                      >
                                          {selectedSector.name}
                                      </motion.h3>
                                      <motion.p
                                          className="text-slate-300 text-base font-medium"
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.4 }}
                                      >
                                          {selectedSector.description}
                                      </motion.p>
                                  </div>
                              </div>
                          </div>

                          {/* Skills section with cards */}
                          <div className="p-8 pt-6">
                              <motion.h4
                                  className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                              >
                                  <div
                                      className="w-8 h-0.5 rounded-full"
                                      style={{
                                          backgroundColor: selectedSector.color,
                                      }}
                                  />
                                  {t.common.coreTechnologies}
                              </motion.h4>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {selectedSector.skills.map((skill, idx) => (
                                      <motion.div
                                          key={skill.name}
                                          className="group relative p-4 rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                                          style={{
                                              backgroundColor:
                                                  "rgba(30, 41, 59, 0.5)",
                                              border: `1px solid rgba(148, 163, 184, 0.1)`,
                                          }}
                                          initial={{
                                              opacity: 0,
                                              y: 20,
                                              scale: 0.9,
                                          }}
                                          animate={{
                                              opacity: 1,
                                              y: 0,
                                              scale: 1,
                                          }}
                                          transition={{
                                              delay: 0.6 + idx * 0.08,
                                              type: "spring",
                                              stiffness: 200,
                                              damping: 20,
                                          }}
                                          whileHover={{
                                              scale: 1.05,
                                              backgroundColor: `${selectedSector.color}15`,
                                              borderColor: selectedSector.color,
                                              transition: { duration: 0.2 },
                                          }}
                                      >
                                          {/* Glow on hover */}
                                          <div
                                              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                              style={{
                                                  boxShadow: `inset 0 0 20px ${selectedSector.color}30`,
                                              }}
                                          />

                                          <div className="relative z-10 flex items-center gap-3">
                                              {/* Skill Icon */}
                                              <motion.div
                                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-700/50 p-2 relative"
                                                  whileHover={{
                                                      scale: 1.1,
                                                      rotate: 5,
                                                  }}
                                                  transition={{
                                                      type: "spring",
                                                      stiffness: 400,
                                                      damping: 10,
                                                  }}
                                              >
                                                  <SkillIcon
                                                      skill={skill}
                                                      size={40}
                                                  />
                                              </motion.div>

                                              {/* Skill Name */}
                                              <div className="flex-1">
                                                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors block">
                                                      {skill.name}
                                                  </span>
                                              </div>

                                              {/* Glow Indicator */}
                                              <motion.div
                                                  className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 flex-shrink-0"
                                                  style={{
                                                      backgroundColor:
                                                          selectedSector.color,
                                                  }}
                                                  whileHover={{ scale: 1.5 }}
                                              />
                                          </div>

                                          {/* Animated border on hover */}
                                          <motion.div
                                              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                                              style={{
                                                  border: `1px solid ${selectedSector.color}`,
                                              }}
                                              initial={false}
                                          />
                                      </motion.div>
                                  ))}
                              </div>
                          </div>

                          {/* Footer */}
                          <motion.div
                              className="px-8 pb-6 flex items-center justify-between"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                          >
                              <p className="text-xs text-slate-500 font-mono">
                                  {t.common.pressEscToResume}
                              </p>
                          </motion.div>
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>

          {/* Sector Grid */}
          <motion.div
              className="mt-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
          >
              {sectors.map((sector, idx) => (
                  <motion.button
                      key={sector.id}
                      className="relative overflow-hidden p-5 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 group"
                      style={{
                          boxShadow: `0 0 20px ${sector.color}20`,
                      }}
                      onClick={() => handleSectorClick(sector)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                  >
                      {/* Gradient overlay */}
                      <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                          style={{
                              background: `linear-gradient(135deg, ${sector.color} 0%, transparent 100%)`,
                          }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-3">
                              <div
                                  className="w-2 h-8 rounded-full flex-shrink-0 shadow-lg"
                                  style={{
                                      backgroundColor: sector.color,
                                      boxShadow: `0 0 10px ${sector.color}`,
                                  }}
                              />
                              <div className="flex-1 text-left">
                                  <h4 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">
                                      {sector.name}
                                  </h4>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                      {sector.skills.length}{" "}
                                      {t.common.technologies}
                                  </p>
                              </div>
                          </div>

                          {/* Skill Icons Preview */}
                          <div className="flex items-center gap-2 flex-wrap">
                              {sector.skills
                                  .slice(0, 5)
                                  .map((skill, skillIdx) => (
                                      <motion.div
                                          key={skill.name}
                                          className="w-8 h-8 rounded-lg bg-slate-700/50 p-1.5 relative flex items-center justify-center"
                                          initial={{ opacity: 0, scale: 0 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{
                                              delay:
                                                  0.6 +
                                                  idx * 0.05 +
                                                  skillIdx * 0.03,
                                          }}
                                          whileHover={{
                                              scale: 1.2,
                                              zIndex: 10,
                                          }}
                                      >
                                          <SkillIcon skill={skill} size={32} />
                                      </motion.div>
                                  ))}
                              {sector.skills.length > 5 && (
                                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs text-slate-400 font-bold">
                                      +{sector.skills.length - 5}
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Border glow on hover */}
                      <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
                          style={{
                              boxShadow: `inset 0 0 20px ${sector.color}30`,
                          }}
                      />
                  </motion.button>
              ))}
          </motion.div>

          {/* Styles */}
          <style jsx>{`
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
      </section>
  );
}
