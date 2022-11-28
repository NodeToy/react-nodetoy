import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

const RendererSettings = () => {
    const { gl } = useThree();
    useEffect(() => {
        gl.outputEncoding = THREE.LinearEncoding;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = .9;
    }, []);
    return null;
};

export default RendererSettings;
