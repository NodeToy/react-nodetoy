import React from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { NodeToyMaterial } from '../../../src';
import RendererSettings from '../../renderSettings';
import { useGLTF, OrbitControls, useFBO, Environment } from '@react-three/drei'
import { useControls } from 'leva'

function Thing() {
  const ref = useRef<any>(null);

  useFrame(() => {
    //ref.current.rotation.x = ref.current.rotation.y += 0.01;
  });

  // GUI to control parameters
  const materialProps = useControls({
    transmissionCoeff: { value: 1.3, min: 0.5, max: 5, step: 0.1 },
    clearcoathVar: { value: 1.0, min: 0, max: 1, step: 0.1 },
    clearcoatRoughVar: { value: 0.3, min: 0, max: 1, step: 0.1 },
    transmissionMode: { value: 0, min: 0, max: 2, step: 1 },
  })

  return (
    <mesh
      ref={ref}
      onClick={(e) => console.log('click')}
      // onPointerOver={(e) => console.log('hover')}
      // onPointerOut={(e) => console.log('unhover')}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
    >
      <sphereBufferGeometry attach="geometry" args={[3, 100, 100]} />
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
  </Canvas>
)

export default App
