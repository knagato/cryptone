import { useGLTF } from "@react-three/drei";
import React, { FC } from "react";
import { GLTFResult } from ".";

export const Poster2: FC<GLTFResult> = () => {
  const { nodes, materials } = useGLTF(
    "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/scene.gltf"
  ) as GLTFResult;

  return (
    <group
      position={[335.46, -77.3, -495.94]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={100}
    >
      <mesh
        geometry={nodes.Plane_Poster2_0.geometry}
        material={materials.Poster2}
      />
    </group>
  );
};
