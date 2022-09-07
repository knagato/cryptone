import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { NextPage } from "next";
import React from "react";
import { DiscJacket } from "src/components/Altar/DiscJacket";
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
        {/* <PerspectiveCamera makeDefault /> */}
        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          rotation={[0, 0, 0]}
          enableZoom
          enablePan
        />
        <Room />
        <DiscJacket position={[1, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default Altar;
