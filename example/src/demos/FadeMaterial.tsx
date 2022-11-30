import React from 'react';
import { NodeToyMaterial } from '@nodetoy/react-nodetoy';
import * as THREE from "three"
import { useRef, useState } from "react"
import { Canvas, extend, useFrame } from "@react-three/fiber"
import { useTexture, shaderMaterial } from "@react-three/drei"

console.log('nodeToyMaterial', NodeToyMaterial);

function FadingImage() {
  const materialRef = useRef<any>(null);
  const uniformRef = useRef<any>({
    dispFactor: 0, 
  });
  const [hovered, setHover] = useState(false);
  
  useFrame(() => {
    if (!materialRef.current) return;
    let dispFactor = uniformRef.current.dispFactor;
    dispFactor = THREE.MathUtils.lerp(dispFactor, hovered ? 1 : 0, 0.075);
    materialRef.current.uniforms.dispFactor = { value: dispFactor };
    uniformRef.current.dispFactor = dispFactor;
  });
  
  return (
    <mesh 
      onPointerOver={(e) => setHover(true)} 
      onPointerOut={(e) => setHover(false)}>
      <planeGeometry />
      <NodeToyMaterial 
        ref={materialRef}
        url={"https://dev-draft.nodetoy.co/IIkL6Yx0NxqD28px"} 
        />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
      <FadingImage />
    </Canvas>
  )
}