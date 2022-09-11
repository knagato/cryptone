import { ThreeElements } from "@react-three/fiber";
import React, { FC, useRef } from "react";

type Props = ThreeElements["mesh"];

export const DiscJacket: FC<Props> = ({ ...props }) => {
  const mesh = useRef<THREE.Mesh>(null!);

  return (
    <mesh {...props} ref={mesh} onClick={() => alert("Hellooo")}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};
