import { useGLTF } from "@react-three/drei";
import { FC } from "react";
import { GLTFResult } from ".";

export const Poster4: FC = () => {
  const { nodes, materials } = useGLTF(
    "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/scene.gltf"
  ) as GLTFResult;

  return (
    <group
      position={[-292.26, 112.27, -495.94]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={100}
    >
      <mesh
        geometry={nodes.Plane007_Poster4_0.geometry}
        material={materials.Poster4}
      />
    </group>
  );
};
