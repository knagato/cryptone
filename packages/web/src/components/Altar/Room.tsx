import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Box3, Group, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PastelGamingRoom } from "./scenes/PastelGamingRoom";
import { fitCameraToCenteredObject } from "./utils";

export const Room = () => {
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const orbitControl = useThree((state) => state.controls as OrbitControls);
  const groupRef = useRef<Group>(null);

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

  return (
    <group ref={groupRef} dispose={null}>
      <PastelGamingRoom />
    </group>
  );
};
