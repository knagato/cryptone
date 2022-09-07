import { ThreeElements, useFrame } from "@react-three/fiber";
import React, { FC, useRef } from "react";

type Props = ThreeElements["mesh"];

export const DiscJacket: FC<Props> = ({ ...props }) => {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => (mesh.current.rotation.x += 0.01))

  return (
    <mesh {...props} ref={mesh} onClick={() => alert("Hellooo")}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};
