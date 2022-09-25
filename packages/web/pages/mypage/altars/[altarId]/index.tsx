import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { NextPage } from "next";
import React, { Suspense, useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { Loader } from "src/components/Altar/Loader";
import { Room, useStore } from "src/components/Altar";
import { SelectJacketModal } from "src/components/Altar/SelectJacketModal";
import { JacketDetailModal } from "src/components/Altar/JacketDetailModal";
import { Notification } from "src/components/Notification";
import { useRouter } from "next/router";
import { useAltar } from "src/api/hooks";

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

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
        <button
          onClick={() => {
            copyToClipboard(`${window.location.host}/altars/${altarId}`);
            setOpen(true);
          }}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Share
        </button>
        <Notification
          open={open}
          onClose={() => setOpen(false)}
          title="Successfully copied!"
        />
      </div>

      <div className="h-[70vh] mt-8">
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

      <SelectJacketModal />

      <JacketDetailModal />
    </div>
  );
};

export default Home;
