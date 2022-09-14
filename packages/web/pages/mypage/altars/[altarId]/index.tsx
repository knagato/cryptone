import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { NextPage } from "next";
import React, { Suspense } from "react";
import { Loader } from "src/components/Altar/Loader";
import { Room, useStore } from "src/components/Altar";
import { SelectJacketModal } from "src/components/Altar/SelectJacketModal";

const Home: NextPage = () => {
  const selectedJacket = useStore((state) => state.selectedJacket);
  const actions = useStore((state) => state.actions);

  return (
    <div className="container mx-auto py-16">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          My awesome altar1
        </h2>
      </div>

      <div className="h-[80vh]">
        <Canvas
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
            alpha: true,
          }}
        >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
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

      <SelectJacketModal
        open={!!selectedJacket}
        onClose={() => actions?.setOpenJacketModal(undefined)}
      />
    </div>
  );
};

export default Home;