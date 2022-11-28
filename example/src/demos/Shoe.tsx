
import React from 'react';
import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber"
import { ContactShadows, Environment, useGLTF, OrbitControls } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"
import { NodeToyMaterial } from '../../../src';

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state: any = proxy({
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  },
})

function Shoe() {
  const ref = useRef<any>()
  const snap = useSnapshot(state)
  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes } is an extra that come from useLoader and it do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes
  const { nodes } = useGLTF("/shoe-draco.glb") as any;


  // Animate model
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20
    ref.current.rotation.x = Math.cos(t / 4) / 8
    ref.current.rotation.y = Math.sin(t / 4) / 8
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  // Cursor showing current color
  const [hovered, set] = useState<any>(null);
  useEffect((): any => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
      return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
    }
    return () => (document.body.style.cursor = "")
  }, [hovered])

  function hexToRgba(hex: any, opacity = 1) {
    const array = (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l:any) { return parseInt(hex.length%2 ? l+l : l, 16) }).concat(isFinite(opacity) ? opacity : 1);
    return [array[0]/255, array[1]/255, array[2]/255, array[3]]
  }

  const lacesCol = hexToRgba(snap.items.laces);
  // Using the GLTFJSX output here to wire in app-state and hook up events
  return (
    <group
      ref={ref}
      dispose={null}
      onPointerOver={(e: any) => (e.stopPropagation(), set(e.object.material.name))}
      onPointerOut={(e: any) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e: any) => (e.stopPropagation(), (state.current = e.object.material.name))}
    >
      <mesh receiveShadow castShadow geometry={(nodes as any).shoe.geometry}> 
        <NodeToyMaterial 
          name={"laces"}
          verbose={true}
          url={"https://draft.nodetoy.co/ji2IAhGHrUXTdODt"} 
          // parameters={{
          //   lace: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
          // }}
        />
      </mesh>


      <mesh receiveShadow castShadow geometry={(nodes as any).shoe_1.geometry} >
        <NodeToyMaterial 
            name={"mesh"}
            url={"https://draft.nodetoy.co/ji2IAhGHrUXTdODt"} 
            // parameters={{
            //   mesh: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            // }}
          />
      </mesh>



      {/* <mesh receiveShadow castShadow geometry={(nodes as any).shoe_1.geometry} >
        <NodeToyMaterial 
            name={"mesh"}
            url={"https://dev-draft.nodetoy.co/kqzlqse3Ra5eXPvT"} 
            parameters={{
              mesh: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            }}
          />
      </mesh>
      <mesh receiveShadow castShadow geometry={(nodes as any).shoe_2.geometry} >
        <NodeToyMaterial 
            name={"caps"}
            url={"https://dev-draft.nodetoy.co/zZE9fTiD617iS3Jy"} 
            parameters={{
              caps: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            }}
          />
      </mesh>
      <mesh receiveShadow castShadow geometry={(nodes as any).shoe_3.geometry} >
        <NodeToyMaterial 
            name={"inner"}
            url={"https://dev-draft.nodetoy.co/3kqR8CPQdGqyWN7L"} 
            parameters={{
              inner: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            }}
          />
      </mesh>
      <mesh receiveShadow castShadow geometry={(nodes as any).shoe_4.geometry} >
        <NodeToyMaterial 
        name={"sole"}
            url={"https://dev-draft.nodetoy.co/NvlRpWew0kgArdQA"} 
            parameters={{
              sole: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            }}
          />
      </mesh>
      <mesh receiveShadow castShadow geometry={(nodes as any).shoe_5.geometry} >
        <NodeToyMaterial 
            name={"stripes"}
            url={"https://dev-draft.nodetoy.co/ogBX4ub7pM98z02h"} 
            parameters={{
              stripes: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            }}
          />
      </mesh>
      <mesh receiveShadow castShadow geometry={(nodes as any).shoe_6.geometry} >
        <NodeToyMaterial 
            name={"band"}
            url={"https://dev-draft.nodetoy.co/jebJnD3kke0BxQPg"} 
            parameters={{
              band: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            }}
          />
      </mesh>
      <mesh receiveShadow castShadow geometry={(nodes as any).shoe_7.geometry} >
        <NodeToyMaterial 
            name={"patch"}
            url={"https://dev-draft.nodetoy.co/Lr45kjm9kBN4vt3i"} 
            parameters={{
              patches: {x: lacesCol[0], y: lacesCol[1], z: lacesCol[2], w: lacesCol[3]},
            }}
          />
      </mesh> */}
    </group>
  )
}

function Picker() {
  const snap: any = useSnapshot(state)
  return (
    <div style={{ display: snap.current ? "block" : "none", position:"absolute", top:"20px",left:"50px"}}>
      <HexColorPicker 
        className="picker" 
        color={snap.items[snap.current]} 
        onChange={(color) => (state.items[snap.current] = color)} 
      />
      <h1 style={{fontSize:"52px"}}>{snap.current}</h1>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <Suspense fallback={null}>
          <Shoe />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
        </Suspense>
        <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
      </Canvas>
      <Picker />
    </>
  )
}
