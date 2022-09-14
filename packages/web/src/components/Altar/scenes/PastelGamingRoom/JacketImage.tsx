import { useTexture } from "@react-three/drei";
import { FC } from "react";
import { RepeatWrapping, sRGBEncoding } from "three";
import { JacketKey, useStore } from "../../store";
import { JACKET_INFO } from "./constants";

type Props = {
  jacketKey: JacketKey;
};

export const JacketImage: FC<Props> = ({ jacketKey }) => {
  const jacket = JACKET_INFO[jacketKey];

  const actions = useStore((state) => state.actions);
  const displayedJacket = useStore((state) => state.displayedJacket);

  const textureUrl =
    displayedJacket[jacketKey] ??
    "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/default_jacket.png";

  const texture = useTexture(textureUrl, (t) => {
    if (Array.isArray(t)) return;
    t.encoding = sRGBEncoding;
    t.wrapS = t.wrapT = RepeatWrapping;
    t.flipY = false;
  });
  useTexture.preload(textureUrl);

  return (
    <group
      position={jacket.position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={100}
      onClick={() => {
        actions?.setOpenJacketModal(jacketKey);
      }}
    >
      <mesh>
        <boxGeometry args={[2, 0.01, 2]} />
        <meshStandardMaterial map={texture} needsUpdate />
      </mesh>
    </group>
  );
};
