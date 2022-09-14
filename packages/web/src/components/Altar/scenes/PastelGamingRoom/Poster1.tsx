import { useTexture } from "@react-three/drei";
import { FC } from "react";
import { RepeatWrapping, sRGBEncoding } from "three";
import { useStore } from "../../store";

export const Poster1: FC = () => {
  const actions = useStore((state) => state.actions);
  const openJacketModal = useStore((state) => state.openJacketModal);
  const displayedJacket = useStore((state) => state.displayedJacket);

  const textureUrl =
    displayedJacket["1"] ??
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
      position={[21.53, 5.54, -495.94]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={100}
      onClick={() => {
        actions?.setOpenJacketModal(!openJacketModal);
      }}
    >
      <mesh>
        <boxGeometry args={[2, 0.01, 2]} />
        <meshStandardMaterial map={texture} needsUpdate />
      </mesh>
    </group>
  );
};
