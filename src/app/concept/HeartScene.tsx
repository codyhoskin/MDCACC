"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Heart({ progress, reduced, onReady }: { progress: number; reduced: boolean; onReady: () => void }) {
  const { scene } = useGLTF("/models/realisticheart/scene.gltf");
  useEffect(() => { onReady?.(); }, [onReady]);
  const group = useRef<THREE.Group>(null);
  const animated = useRef(0);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    const solids: THREE.MeshStandardMaterial[] = [];
    const meshes: THREE.Mesh[] = [];
    copy.traverse((object) => { if (object instanceof THREE.Mesh) meshes.push(object); });
    meshes.forEach((mesh) => {
      const material = new THREE.MeshStandardMaterial({ color: "#3189ec", roughness: .48, metalness: .12 });
      mesh.material = material;
      solids.push(material);
    });
    copy.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(copy);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 3.8 / Math.max(size.x, size.y, size.z);
    const normalized = new THREE.Group();
    normalized.add(copy);
    copy.position.sub(center);
    normalized.scale.setScalar(scale);
    return { normalized, solids };
  }, [scene]);

  useEffect(() => () => {
    model.solids.forEach(m => m.dispose());
  }, [model]);

  useFrame((_, delta) => {
    if (!group.current) return;
    animated.current = reduced ? 0 : THREE.MathUtils.damp(animated.current, progress, 7, delta);
    const t = animated.current;
    group.current.rotation.set(.08 + t * .12, -.35 + t * 1.35, -.08 + t * .12);
    // Exterior-only placeholder until a licensed chamber model or render is supplied.
    group.current.scale.setScalar(1 + t * .12);
  });

  return <group ref={group}><primitive object={model.normalized} /></group>;
}

export default function HeartScene({ progress, reduced, onReady }: { progress: number; reduced: boolean; onReady: () => void }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7.1], fov: 36 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-3, 5, 5]} intensity={4} color="#f5f8ff" />
      <directionalLight position={[4, 1, -2]} intensity={3} color="#d5e6ff" />
      <directionalLight position={[0, -3, 4]} intensity={.5} />
      <Suspense fallback={null}><Heart progress={progress} reduced={reduced} onReady={onReady} /></Suspense>
    </Canvas>
  );
}
