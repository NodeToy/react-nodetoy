import React from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { forwardRef } from 'react';
import {
	NodeToyMaterial as ThreeNodeToyMaterial,
	NodeToyCullMode,
	NodeToyMaterialType,
	NodeToyMaterialData,
} from '@nodetoy/three-nodetoy';

extend({ ThreeNodeToyMaterial });

export interface NodeToyMaterialProps {
    url?: string;
	data?: NodeToyMaterialData;
    parameters?: any;
    toneMapped?: boolean;
    flatShading?: boolean;
    transparent?: boolean;
    cullMode?: NodeToyCullMode;
    verbose?: boolean;
    polygonOffset?: boolean;
    polygonOffsetFactor?: number;
    depthTest?: boolean;
    depthWrite?: boolean;
    envMapIntensity?: number;
}

const NodeToyMaterial = forwardRef<NodeToyMaterialProps, any>(
	(
		props,
		ref
	) => {

	// @ts-ignore
	return <threeNodeToyMaterial
		ref={ref}
		url={props.url}
		data={props.data}
		parameters={props.parameters}
		toneMapped={props.toneMapped}
		flatShading={props.flatShading}
		transparent={props.transparent}
		cullMode={props.cullMode}
		verbose={props.verbose}
		polygonOffset={props.polygonOffset}
		polygonOffsetFactor={props.polygonOffsetFactor}
		depthTest={props.depthTest}
		depthWrite={props.depthTest}
		envMapIntensity={props.envMapIntensity}
		name={props.name}
		/>
});


const NodeToyTick = ()=>{
	useFrame(()=>{
		ThreeNodeToyMaterial.tick();
	});
	return <></>
}


// ---

// Utils
const swapMaterial = (nodes: THREE.Object3D | THREE.Object3D[], material: THREE.Material, newMaterial: THREE.Material) => {
	if (Array.isArray(nodes)) {
	  for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i] as THREE.Mesh;
		if (node.isMesh && node.material === material) {
		  node.material = newMaterial
		}
		if (node.children && node.children.length) {
		  swapMaterial(node.children, material, newMaterial);
		}
	  }
	}
	else {
	  swapMaterial([nodes], material, newMaterial);
	}  
}

// ---

export {
	NodeToyCullMode,
	NodeToyMaterialType,
	NodeToyMaterial,
	NodeToyTick,
	ThreeNodeToyMaterial,
	swapMaterial
};
