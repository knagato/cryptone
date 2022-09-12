import { useFBX, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Box3, Group, Object3D, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { DiscJacket } from "./DiscJacket";
import { fitCameraToCenteredObject, isMesh } from "./utils";

const glbModelUrl =
  "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cute_isometric_room.glb";
const fbxModelUrl =
  "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/room.fbx";

export const Room = () => {
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const orbitControl = useThree((state) => state.controls as OrbitControls);
  const groupRef = useRef<Group>(null);

  const { scene, nodes } = useGLTF(glbModelUrl) as GLTF & {
    nodes: Record<string, Object3D>;
  };
  useGLTF.preload(glbModelUrl);

  const fbx = useFBX(fbxModelUrl);

  const meshes = useMemo(() => Object.values(nodes).filter(isMesh), [nodes]);

  useEffect(() => {
    if (!camera || !orbitControl || !groupRef.current) return;

    groupRef.current.rotateY(-Math.PI / 8);

    const box = new Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new Vector3());
    groupRef.current.translateX(-center.x);
    groupRef.current.translateY(-center.y);
    groupRef.current.translateZ(-center.z);

    fitCameraToCenteredObject(camera, groupRef.current, orbitControl);
  }, [camera, orbitControl]);

  console.log(meshes);

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
      {/* {meshes.map((mesh) => (
        <mesh key={mesh.id} {...mesh}>
        </mesh>
      ))} */}

      <DiscJacket />
    </group>
  );
};
