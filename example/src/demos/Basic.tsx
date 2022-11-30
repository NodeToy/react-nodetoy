import React from 'react';
import * as THREE from "three";
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { NodeToyMaterial, NodeToyTick } from '@nodetoy/react-nodetoy';
import RendererSettings from '../renderSettings';
import { useGLTF, OrbitControls, useFBO, Environment } from '@react-three/drei'
import { useControls } from 'leva'

const sphereGeometry = new THREE.SphereGeometry(3, 100, 100);
sphereGeometry.computeTangents(); // NEEDED if there is a normal map

function Thing() {
  const ref = useRef<any>(null);

  useFrame(() => {
    //ref.current.rotation.x = ref.current.rotation.y += 0.01;
  });

  // GUI to control parameters
  const materialProps = useControls({
    transmissionCoeff: { value: 1.3, min: 0.5, max: 5, step: 0.1 }, // Level of transmission
    clearcoathVar: { value: 1.0, min: 0, max: 1, step: 0.1 }, // Clearcoat 
    clearcoatRoughVar: { value: 0.3, min: 0, max: 1, step: 0.1 }, // Clearcoat roughness 
    transmissionMode: { value: 0, min: 0, max: 2, step: 1 }, // Type of force shield
  })

  return (
    <mesh
      ref={ref}
      onClick={(e) => console.log('click')}
      // onPointerOver={(e) => console.log('hover')}
      // onPointerOut={(e) => console.log('unhover')}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
      geometry={sphereGeometry}
    >
      <NodeToyMaterial 
        //verbose={true}
        url={"https://dev-draft.nodetoy.co/1JrV1CcXr6Hrs8te"} 
        parameters={materialProps}
        //cullMode={NodeToyCullMode.None}
      />
    </mesh>
  )
}




function NodeToyApp() {

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight color={0xffffff}/>
      <RendererSettings/>
      <Environment files="/old_depot_2k.hdr" />
      <Thing />
    </>
  );
}

const App = () => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 3, 10] }}>
    <color attach="background" args={['#292929']} /> 
    <group position={[0, 0, 0]}>
      <NodeToyApp/>
    </group>
    <OrbitControls />
    <NodeToyTick/>
  </Canvas>
)

export default App
