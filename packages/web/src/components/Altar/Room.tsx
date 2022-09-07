import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Box3, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Loader } from "./Loader";
import { fitCameraToCenteredObject } from "./utils";

const modelUrl =
  "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cute_isometric_room.glb";
export const Room = () => {
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const orbitControl = useThree((state) => state.controls as OrbitControls);

  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    if (!camera || !orbitControl) return;

    scene.rotation.y = -Math.PI / 4;

    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    scene.translateX(-center.x);
    scene.translateY(-center.y);
    scene.translateZ(-center.z);

    fitCameraToCenteredObject(camera, scene.children[0], orbitControl);

    return () => {
      // Remove cached data when component is unmounted
      useGLTF.clear(modelUrl);
    };
  }, [camera, orbitControl, scene]);

  return (
    <Suspense fallback={<Loader />}>
      <primitive object={scene} />
    </Suspense>
  );
};
