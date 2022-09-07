import { Html, useProgress } from "@react-three/drei";

export const Loader = () => {
  const { progress } = useProgress();
  return <Html center>Loading...{progress.toFixed(0)}%</Html>;
};
