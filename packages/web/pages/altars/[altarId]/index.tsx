import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { Suspense, useEffect } from "react";
import { useAltar } from "src/api/hooks";
import { useStore } from "src/components/Altar";
import { JacketDetailModal } from "src/components/Altar/JacketDetailModal";
import { Loader } from "src/components/Altar/Loader";
import { Room } from "src/components/Altar/Room";

const Altar: NextPage = () => {
  const router = useRouter();
  const { altarId } = router.query;
  const actions = useStore((state) => state.actions);

  const { data } = useAltar(
    typeof altarId === "string" ? parseInt(altarId) : undefined
  );

  useEffect(() => {
    if (!data?.data) return;
    actions.init(data.data);
  }, [actions, data]);

  return (
    <div className="container mx-auto py-16">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          My awesome altar1
        </h2>
      </div>

      <div className="h-[70vh]">
        <Canvas
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
            alpha: true,
          }}
        >
          <ambientLight />
          <pointLight intensity={0.3} position={[10, 10, 10]} />
          <color attach="background" args={["gray"]} />
          <OrbitControls
            makeDefault
            target={[0, 0, 0]}
            rotation={[0, 0, 0]}
            enableZoom
            enablePan
          />
          <Suspense fallback={<Loader />}>
            <Room />
          </Suspense>
        </Canvas>
      </div>
      <JacketDetailModal />
    </div>
  );
};

export default Altar;
