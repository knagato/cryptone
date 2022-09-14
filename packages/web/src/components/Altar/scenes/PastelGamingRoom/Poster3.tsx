import { useGLTF } from "@react-three/drei";
import { FC } from "react";
import { GLTFResult } from ".";

export const Poster3: FC = () => {
  const { nodes, materials } = useGLTF(
    "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/scene.gltf"
  ) as GLTFResult;

  return (
    <group
      position={[62.75, 296.1, -495.94]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={100}
    >
      <mesh
        geometry={nodes.Plane006_Poster3_0.geometry}
        material={materials.Poster3}
      />
    </group>
  );
};
