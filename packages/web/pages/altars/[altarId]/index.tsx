import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { NextPage } from "next";
import React, { Suspense } from "react";
import { Loader } from "src/components/Altar/Loader";
import { Room } from "src/components/Altar/Room";

const Altar: NextPage = () => {
  return (
    <div className="h-[100vh]">
      <Canvas
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: true,
        }}
        // Legacy color management
        legacy
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <color attach="background" args={["rgb(40, 40, 40)"]} />
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
  );
};

export default Altar;
