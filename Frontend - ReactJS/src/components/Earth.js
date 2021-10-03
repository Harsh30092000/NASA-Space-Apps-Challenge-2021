import React from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three';
import EarthImage from "../assets/images/EarthTextureImage2.png";
import { OrbitControls } from "@react-three/drei";

function Earth({ zoomRotate }) {

    const EarthMap = useLoader(TextureLoader, EarthImage);

    return (
        <>
            <ambientLight intensity={1} />
            <mesh>
                <sphereGeometry attach="geometry" args={[2.4, 32, 32]} />
                <meshStandardMaterial map={EarthMap} roughness={0.9} metalness={0.4} />
            </mesh>
            <OrbitControls
                enableZoom={false}
                enableRotate={zoomRotate}
                rotateSpeed={0.5}
            />
        </>
    )
}

export default Earth
