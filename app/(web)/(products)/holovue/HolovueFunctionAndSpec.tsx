'use client'
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber'
import { PointLight } from 'three';

import * as THREE from 'three';
import {
    useLoader
} from '@react-three/fiber'
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from '@react-three/drei'

const Holovue = () => {
    const gltf = useLoader(GLTFLoader, `/holovue/Holovue.gltf`)

    return (
        <group>
            <primitive
                scale={0.18}
                object={gltf.scene}
                position={new THREE.Vector3(
                    0, -2, 0
                )}
            />
        </group>
    )
}

const HolovueFunctionAndSpec = () => {
    const lightRef = useRef<PointLight>(null);

    return (
        <div className="relative w-full m-auto h-auto xl:w-full xl:h-[70vh]"> {/* START HOME THUMB CONTAINER */}
            <div className="z-10 m-auto w-[70%] h-[40vh] xl:w-full xl:h-full">
                <Canvas
                    className='overflow-visible rounded-[20px]'>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                    <OrbitControls
                        enableRotate
                        // autoRotate
                        // rotateSpeed={0.008}
                        onChange={(e) => {
                            if (!e) return;
                            const camera = e.target.object;

                            if (lightRef.current) {
                                lightRef.current.position.set(0, 1, 0);
                                lightRef.current.position.add(camera.position);
                            }
                        }} />
                    <ambientLight intensity={1} />

                    {/* <pointLight
                        color="#782A90"
                        ref={lightRef}
                        intensity={1200}
                        position={[10, 10, 0]}
                    /> */}

                    <pointLight
                        color="#ffffff"
                        ref={lightRef}
                        intensity={100}
                        position={[2, 0, 6]}
                    />

                    <pointLight
                        ref={lightRef}
                        intensity={20}
                        position={[2, 2, 2]}
                    />
                    <Holovue />
                </Canvas>
            </div>
        </div>
    )
}


export default HolovueFunctionAndSpec