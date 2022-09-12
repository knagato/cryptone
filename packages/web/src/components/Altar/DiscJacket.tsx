import { ThreeElements } from "@react-three/fiber";
import React, { FC, useRef } from "react";
import { type Mesh } from "three";

type Props = ThreeElements["mesh"];

export const DiscJacket: FC<Props> = ({ ...props }) => {
  const mesh = useRef<Mesh>(null);

  return (
    <mesh {...props} ref={mesh} onClick={() => alert("Hellooo")}>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={0x0ff000} />
    </mesh>
  );
};
