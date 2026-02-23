import {
    useLoader
} from '@react-three/fiber'
import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


const Holovue = () => {
    const gltf = useLoader(GLTFLoader, `/holovue/Holovue.gltf`)

    return (
        <group>
            <primitive
                scale={0.25}
                object={gltf.scene}
                position={new THREE.Vector3(
                    0, -2.5, 0
                )}
            />
        </group>
    )
}


export default Holovue;

