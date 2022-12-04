
import React, { useLayoutEffect } from 'react';
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { ContactShadows, Environment, useGLTF, OrbitControls, PresentationControls, Stage, MeshReflectorMaterial } from "@react-three/drei"
import { ThreeNodeToyMaterial, swapMaterial, NodeToyTick } from '@nodetoy/react-nodetoy';
import * as THREE from 'three';


/*
Author: Steven Grey (https://sketchfab.com/Steven007)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/lamborghini-urus-2650599973b649ddb4460ff6c03e4aa2
Title: Lamborghini Urus
*/
function Model(props: any) {
  const { scene, nodes, materials } = useGLTF('/lambo.glb') as any;

  useLayoutEffect(() => {
    scene.traverse((obj: any) => obj.type === 'Mesh' && (obj.receiveShadow = obj.castShadow = true))

    const newMaterial = new ThreeNodeToyMaterial({
      url: "https://dev-draft.nodetoy.co/BGNkvfT9otGiOlxk",
      verbose: false,
      parameters: { // These have to have the same names given to the properties
        transmissionCoeff: 1.3,
        clearcoathVar: 1.0,
        clearcoatRoughVar: 0.3,
        transmissionMode: 0,
      },
      // flatShading: true,
      // transparent: true,
    });
    
    swapMaterial(scene, materials.WhiteCar, newMaterial);

  }, [scene, nodes, materials]);
  
  return <primitive object={scene} {...props} />
}


export default function App() {
  return (
    <>
      <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
      <color attach="background" args={['#101010']} />
      <fog attach="fog" args={['#101010', 10, 20]} /> 
        <ambientLight intensity={0.3} />
        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <Suspense fallback={null}>
          <Environment files="/old_depot_2k.hdr" />
          <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
          <Model scale={0.01} position={[0, 0.8, 0]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[170, 170]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={40}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#101010"
              metalness={0.5}
              mirror={1}
            />
          </mesh>
          </PresentationControls>
          <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
        </Suspense>
        <NodeToyTick/>
      </Canvas>
      {/* <Picker /> */}
    </>
  )
}
