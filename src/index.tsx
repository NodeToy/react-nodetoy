import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState, forwardRef } from 'react';
import * as THREE from 'three';
import { 
	generateUniforms, getUniformValue, getFullURL, materialUpdate, 
	GraphLoader,
	initReactThreeFiber, deepCopy, diff
} from '@nodetoy/shared-nodetoy';

export const CubeUVReflectionMapping = 306;

export enum NodeToyCullMode {
	Front,
	Back,
	None,
}

export enum NodeToyMaterialType {
	Standard = 'standard',
	Physical = 'physical',
	Unlit = 'unlit',
}

export enum NodeToyRenderType {
	Opaque = 'opaque',
	Transparent = 'transparent',
}

export interface NodeToyMaterialProps {
	url: string;
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

initReactThreeFiber();

// Create graph loader
const graphLoader = new GraphLoader();

const getTHREECullMode = (cullMode: NodeToyCullMode) => {
	if (cullMode === NodeToyCullMode.None) {
		return THREE.DoubleSide;
	}
	if (cullMode === NodeToyCullMode.Front) {
		return THREE.BackSide;
	}
	return THREE.FrontSide;
}

const NodeToyMaterial = forwardRef<NodeToyMaterialProps, any>(
	(
		props,
		ref
	) => {
		const shader = useRef({
			fragmentShader: null,
			vertexShader: null,
			uniforms: deepCopy(THREE.ShaderLib.physical.uniforms),
		});

		// ---------------
		// INTERNAL DATA

		const [update, setUpdate] = useState(0);
		const loader = useRef(new THREE.TextureLoader());
		const materialRef = useRef<any>(null);
		const shaderRef = useRef<any>(null);
		const dataRef = useRef<any>(null);
		const fullURLRef = useRef('');
		const typeRef = useRef<NodeToyMaterialType>(NodeToyMaterialType.Unlit);
		//const optionsRef = useRef<any>(NodeToyMaterialType.Unlit);
		const reload = useRef<boolean>(false); // Force reload a second time after the first call
		const hasReloaded = useRef<boolean>(false);

		// ---------------

		useEffect(()=>{

			// LOAD
			const onLoad = (obj: any)=>{
				if (obj.url === fullURLRef.current) {
					loadShader(obj.data);
				}
			};
			graphLoader.events.on('load', onLoad);
			return ()=>{
				graphLoader.events.off('load', onLoad);
			}

		}, []);

		useEffect(()=>{
			if (materialRef.current) {
				(materialRef.current as any).normalMap = new THREE.Texture();
				(materialRef.current as any).tangentSpaceNormalMap = new THREE.Texture();
				(materialRef.current as any).aoMap = new THREE.Texture();
				(materialRef.current as any).side = THREE.FrontSide;
				(materialRef.current as any).vertexShader = THREE.ShaderLib.standard.vertexShader;
				(materialRef.current as any).fragmentShader =THREE.ShaderLib.standard.fragmentShader;
				(materialRef.current as any).defines = {
					STANDARD: '',
					USE_NORMALMAP: '',
					USE_TANGENT: '',
					TANGENTSPACE_NORMALMAP: '',
				};
				(materialRef.current as any).envMapIntensity = 1.0;
				(materialRef.current as any).uniforms = deepCopy(THREE.ShaderLib.physical.uniforms);
				(materialRef.current as any).lights = true;
				(materialRef.current as any).isShaderMaterial = true;
				(materialRef.current as any).isMeshStandardMaterial = false;
				(materialRef.current as any).type = 'ShaderMaterial';
				(materialRef.current as any).combine = THREE.MultiplyOperation;

				(materialRef.current as any).onBeforeRender = onBeforeRender;
				(materialRef.current as any).onBuild = onBuild;
				hasReloaded.current = true;
			}
			//console.log("materialRef.current in useEffect ",materialRef.current)

		}, [reload.current]);

		// ---------------

		// ---------------
		// UPDATE SHADER CONFIGURATION

		useEffect(()=>{
			if (materialRef.current) {
				(materialRef.current as any).toneMapped = ("toneMapped" in props) ? props.toneMapped : false;
				(materialRef.current as any).flatShading = ("flatShading" in props) ? props.flatShading : false;
				(materialRef.current as any).transparent = ("transparent" in props) ? props.transparent : ("renderType" in dataRef.current)? dataRef.current.renderType === NodeToyRenderType.Transparent : true;
				(materialRef.current as any).side = ("cullMode" in props) ? getTHREECullMode(props.cullMode) : ("cullMode" in dataRef.current)? fromStringToSideMode(dataRef.current.cullMode) : THREE.FrontSide;
				(materialRef.current as any).verbose = ("verbose" in props) ? props.verbose : false;
				(materialRef.current as any).polygonOffset = ("polygonOffset" in props) ? props.polygonOffset : false;
				(materialRef.current as any).polygonOffsetFactor = ("polygonOffsetFactor" in props) ? props.polygonOffsetFactor : 0.0;
				(materialRef.current as any).depthTest = ("depthTest" in props) ? props.depthTest : true;
				(materialRef.current as any).depthWrite = ("depthWrite" in props) ? props.depthWrite : true;
				(materialRef.current as any).envMapIntensity = ("envMapIntensity" in props) ? props.envMapIntensity : 1.0;
			}
		}, [
			update, 
			props.toneMapped, 
			props.flatShading, 
			props.transparent, 
			props.verbose, 
			props.polygonOffset, 
			props.polygonOffsetFactor, 
			props.depthTest, 
			props.depthWrite, 
			props.envMapIntensity, 
			props.cullMode
		]);


		// -------------------------
		// LOAD

		// Emit load request when graph url changes
		useEffect(()=>{
			if (props.url) {
				reload.current = hasReloaded.current? !reload.current : reload.current;
				const urlGraph = fullURLRef.current = getFullURL(props.url);

				if (props.verbose) {
					console.log(`[NodeToy] loading graph... | url: ${urlGraph}`);
				}	

				// load from cache if available
				if (urlGraph in graphLoader.cache) {
					loadShader(graphLoader.cache[urlGraph]);
				}

				// send load request
				graphLoader.load(urlGraph);
			}
			else {
				console.warn(`[NodeToy] Missing material graph URL. Cannot load shader.`)
			}
		}, [props.url]);

		// Update uniforms
		const updateUniforms = (dataUniforms: any) => {
			let uniforms : any = [] // Changes to array will not change dataUniforms
			Object.assign(uniforms, dataUniforms) // Object.assign(target, source)
			if(props !== null){			
				for (const key in props) {
					for (let i = 0; i < uniforms.length; i++) {
						if(key === uniforms[i].name)
							uniforms[i].value = props[key];
					}
				}
			}
			return uniforms;
		}

		const fromStringToSideMode = (mode : string) => {
			if (mode === "back"){
				return THREE.FrontSide;
			}else if(mode === "front"){
				return THREE.BackSide;
			}
			return THREE.DoubleSide;
		}

		// load the shader from the network data received
		const loadShader = (data: any)=>{

			// save original data
			dataRef.current = data;

			// Get the updated uniforms if any
			const updatedUniforms = updateUniforms(data.uniforms);

			if (props.verbose) {
				console.log(`[NodeToy] graph loaded.`, data, generateUniforms(props.url, data.uniforms, updatedUniforms));
			}

			shader.current = {
				vertexShader: data.vertex,
				fragmentShader: data.fragment, 
				uniforms: generateUniforms(props.url, data.uniforms, updatedUniforms)
			};

			"lightModel" in data && (typeRef.current = data.lightModel);
	
			setUpdate(update+1);
		}
		


		// ---------------
		// NODES UNIFORM UPDATE

		// TICK
		const timeRef = useRef({ time: 0, deltaTime: 0});
		useFrame((e)=>{
			timeRef.current.deltaTime = e.clock.elapsedTime - timeRef.current.time;
			timeRef.current.time = e.clock.elapsedTime;
		});

		const onBeforeRender = ( renderer: any, scene: any, camera: any, _geometry: any, object: any ) => {
			const frame = { 
				camera,
				object,
				renderer,
				scene,
				light: null as any,
				time: timeRef.current.time,
				deltaTime: timeRef.current.deltaTime,
			};
    		const uniforms = shader.current.uniforms as any;

			if (materialRef.current.uniforms) {
				materialUpdate(frame, uniforms);
			}

			if (scene.environment && typeRef.current !== NodeToyMaterialType.Unlit) {
			
				const env = scene.environment.clone();
				env.mapping = THREE.CubeUVReflectionMapping;
				(materialRef.current as any).envMap = env;
				(materialRef.current as any).envMap.mapping = THREE.CubeUVReflectionMapping; // Forcing this type to be able to work with ShaderMaterial
				(materialRef.current as any).envMapMode = CubeUVReflectionMapping;
				(materialRef.current as any).uniforms.envMap.value = env;
				(materialRef.current as any).uniforms.envMapIntensity.value = (materialRef.current as any).envMapIntensity;
	
				(materialRef.current as any).defines = {
					STANDARD: '',
					USE_NORMALMAP: '',
					USE_ENVMAP: '',
					ENVMAP_TYPE_CUBE_UV: '',
					USE_TANGENT: '',
					TANGENTSPACE_NORMALMAP: '',
				};
			}
			else {
				(materialRef.current as any).envMap = null;
				if ('envMap' in (materialRef.current as any).uniforms) {
					(materialRef.current as any).uniforms.envMap.value = null;
				}
				(materialRef.current as any).defines = {
					STANDARD: '',
					USE_NORMALMAP: '',
					USE_TANGENT: '',
					TANGENTSPACE_NORMALMAP: '',
				};
			}
			if(scene.fog){
				(materialRef.current as any).defines.USE_FOG = ''
			}
		};

		const onBuild = ( _object: any, parameters: any, _renderer: any ) => {	
			shaderRef.current = parameters;
			shaderRef.current.vertexShader = shader.current.vertexShader;
			shaderRef.current.fragmentShader = shader.current.fragmentShader;
			if (ref) {
				(ref as any).current = parameters;
			}
			updateShader();
		};

		const updateShader = () => {
			if (shaderRef.current) {
				shaderRef.current.uniforms = {...shaderRef.current.uniforms, ...shader.current.uniforms };
				// shaderRef.current.needsUpdate = true;
			}
		}


		// ---------------
		// PROPS UNIFORM UPDATE

		const prevUniformKeysRef = useRef([] as string[]);
		useEffect(() => {
			let prevUniformKeys = prevUniformKeysRef.current;
			if (props.parameters) {
				// console.log('uniforms', uniforms, shader.current.uniforms);
				
				for (const key in props.parameters) {
					// uniforms does not exists
					if (!(key in shader.current.uniforms)) continue;

					// Remove key from previous keys since we want to override with new key value from props
					if (prevUniformKeys) {
						prevUniformKeys = prevUniformKeys.filter((el: string)=>{ el != key});
					}

					// Get uniform key type
					const type = shader.current.uniforms[key].type;
					if (type === 'texture') {
						// Texture as url
						if (typeof props.parameters[key] === 'string') {
							if (!shader.current.uniforms[key]._value || shader.current.uniforms[key]._value != props.parameters[key]) {
								shader.current.uniforms[key]._value = props.parameters[key];
								shader.current.uniforms[key].value = loader.current.load(props.parameters[key]);
							}
						}
						// Texture as buffer
						else {
							shader.current.uniforms[key].value = props.parameters[key];
						}
					}
					else { // If it is not a texture
						shader.current.uniforms[key].value = props.parameters[key];
					}
				}

				if (props.verbose) {
					console.log(`[NodeToy] uniforms updated.`, props.parameters, shader.current.uniforms);
				}
			}

			// Reset uniforms that have been removed from props override
			if (props.parameters || prevUniformKeys) {
				resetUniformsByName(prevUniformKeys);
				prevUniformKeysRef.current = props.parameters ? Object.keys(props.parameters) : [];
			}

			// updateShader();

			if (!shaderRef.current || shader.current) return;
			
			const current = deepCopy(shaderRef.current.uniforms);
			const updated = shader.current.uniforms;//generateUniforms( this.url, (this as any).uniforms, uniforms, value );
			const updatedKeys = Object.keys(diff(current, updated));

			for (let i = 0; i < updatedKeys.length; i++) {
				const key = updatedKeys[i];
				shaderRef.current.uniforms[key] = updated[key];
			}


		}, [props.parameters, update]);

		// ----


		const resetUniformsByName = (names: string[])=>{
			if (!dataRef.current) return;

			for (let i = 0; i < names.length; i++) {
				const key = names[i];
				for (let j = 0; j < dataRef.current.uniforms.length; j++) {
					const uniform = dataRef.current.uniforms[j] as any;
					if (uniform.name === key) {
						shader.current.uniforms[uniform.name] = { 
							value: getUniformValue(props.url, uniform.type, uniform.value), 
							type: uniform.type 
						};
						break;
					}
				}
			}
			// updateShader();
		}
	
		
		if (shader.current.vertexShader === null) {
			//console.log("shader.current.vertexShader === null ")
			reload.current = true;
			return <></>
		}
		
		return (
			// @ts-ignore
			<shaderMaterial 
				name={props.name? props.name : ""}
				ref={node => {
					// if (ref) {
					// 	(ref as any).current = node;
					// }
					materialRef.current = node;
				}}
				attach="material" />
		);
});

export { 
	NodeToyMaterial
};
