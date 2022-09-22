import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTFResult } from "./type";
import { JacketImage } from "./JacketImage";

const modelUrl =
  "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/scene.gltf";

export function PastelGamingRoom(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(modelUrl) as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <JacketImage jacketKey="1" />
          <JacketImage jacketKey="2" />
          <JacketImage jacketKey="3" />
          <JacketImage jacketKey="4" />

          <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <mesh
              geometry={nodes.Room_Material001_0.geometry}
              material={materials["Material.001"]}
            />
            <mesh
              geometry={nodes.Room_Material002_0.geometry}
              material={materials["Material.002"]}
            />
          </group>
          <group
            position={[735.89, 495.83, 692.58]}
            rotation={[Math.PI, 0.76, 2.68]}
            scale={100}
          />
          <group
            position={[0, -230.69, -312.45]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group rotation={[Math.PI / 2, 0, 0]} />
          </group>
          <group
            position={[-40.23, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Room001_Glass_0.geometry}
              material={materials.Glass}
            />
            <mesh
              geometry={nodes.Room001_Wall_0.geometry}
              material={materials.Wall}
            />
          </group>
          <group
            position={[586.9, -179.66, 759.59]}
            rotation={[0.91, 0.7, 0.33]}
            scale={100}
          >
            <group rotation={[Math.PI / 2, 0, 0]} />
          </group>
          <group
            position={[469.83, -179.66, 759.59]}
            rotation={[-0.66, 1.01, -0.3]}
            scale={100}
          >
            <group rotation={[Math.PI / 2, 0, 0]} />
          </group>
          <group
            position={[343.89, -179.66, 759.59]}
            rotation={[1.58, 1.11, -1.17]}
            scale={100}
          >
            <group rotation={[Math.PI / 2, 0, 0]} />
          </group>
          <group
            position={[0, -344.33, -380.67]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[0, 0.02, -1.11]}>
              <mesh
                geometry={nodes.Cube004_Table_0.geometry}
                material={materials.Table}
              />
            </group>
            <mesh
              geometry={nodes.TvTable_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[0, -255.99, -381.18]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[0, -0.01, 0.14]}>
              <mesh
                geometry={nodes.TVScreen_tvScreen_0.geometry}
                material={materials.tvScreen}
              />
            </group>
            <mesh
              geometry={nodes.TV_tv_0.geometry}
              material={materials.material}
            />
          </group>
          <group
            position={[-27.11, -427.05, -341.7]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Console_Material_0.geometry}
              material={materials.Material}
            />
            <mesh
              geometry={nodes.Console_tv_0.geometry}
              material={materials.material}
            />
            <mesh
              geometry={nodes.Console_Poster_0.geometry}
              material={materials.Poster}
            />
          </group>
          <group
            position={[0, -367.33, 413.77]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[0, 3.02, 3.42]}>
              <mesh
                geometry={nodes.Cube007_Couch_0.geometry}
                material={materials.Couch}
              />
            </group>
            <group position={[0.01, 1.06, -0.25]}>
              <mesh
                geometry={nodes.Cube008_Couch_0.geometry}
                material={materials.Couch}
              />
            </group>
            <group position={[-1.36, 1.06, -0.25]}>
              <mesh
                geometry={nodes.Cube009_Couch_0.geometry}
                material={materials.Couch}
              />
            </group>
            <group position={[1.38, 0.59, 0.47]}>
              <mesh
                geometry={nodes.Cube010_Couch_0.geometry}
                material={materials.Couch}
              />
            </group>
            <group position={[0.01, 0.52, 0.5]}>
              <mesh
                geometry={nodes.Cube011_Couch_0.geometry}
                material={materials.Couch}
              />
            </group>
            <group position={[-1.36, 0.51, 0.47]}>
              <mesh
                geometry={nodes.Cube012_Couch_0.geometry}
                material={materials.Couch}
              />
            </group>
            <group position={[2.34, -0.07, -1.15]}>
              <mesh
                geometry={nodes.Cube013_CoffeeTable_0.geometry}
                material={materials.CoffeeTable}
              />
            </group>
            <group position={[2.34, 1.5, -1.15]}>
              <mesh
                geometry={nodes.Cube014_CoffeeTable_0.geometry}
                material={materials.CoffeeTable}
              />
            </group>
            <group position={[-2.37, 1.5, -1.15]}>
              <mesh
                geometry={nodes.Cube015_CoffeeTable_0.geometry}
                material={materials.CoffeeTable}
              />
            </group>
            <group position={[-2.37, -0.07, -1.15]}>
              <mesh
                geometry={nodes.Cube016_CoffeeTable_0.geometry}
                material={materials.CoffeeTable}
              />
            </group>
            <mesh
              geometry={nodes.Couch_Couch_0.geometry}
              material={materials.Couch}
            />
          </group>
          <group
            position={[0, -413.11, -32.57]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[1.34, -0.57, -0.49]}>
              <mesh
                geometry={nodes.Cube001_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[1.34, 0.53, -0.49]}>
              <mesh
                geometry={nodes.Cube002_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[-1.31, -0.57, -0.49]}>
              <mesh
                geometry={nodes.Cube003_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[-1.31, 0.53, -0.49]}>
              <mesh
                geometry={nodes.Cube005_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <mesh
              geometry={nodes.Table_CoffeeTable_0.geometry}
              material={materials.CoffeeTable}
            />
          </group>
          <group
            position={[0, -497.56, -28.12]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Plane001_Rug_0.geometry}
              material={materials.material_14}
            />
          </group>
          <group
            position={[-102.62, -391.05, -26.76]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.PizzaBox_PizzaBox_0.geometry}
              material={materials.PizzaBox}
            />
          </group>
          <group
            position={[-99.82, -400.7, -30.99]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube019_PizzaBox_0.geometry}
              material={materials.PizzaBox}
            />
          </group>
          <group
            position={[-167.97, -421.31, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube021_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[-162.38, -421.32, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube022_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[-156.8, -421.31, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube023_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-151.18, -421.3, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube024_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[-146.05, -421.31, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube025_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-140.68, -421.31, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube026_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-135.41, -421.31, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube027_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[-129.79, -422.64, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube028_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[-124.23, -420.67, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube029_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-118.61, -422.15, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube030_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[-113.48, -422.14, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube031_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[-108.12, -421.33, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube032_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[32.71, -437.98, -426.05]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube033_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-51.8, -410.85, -341.82]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube034_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[23.42, -403.02, -42.11]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube035_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[23.42, -398.33, -42.11]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube036_Poster1_0.geometry}
              material={materials.Poster1}
            />
          </group>
          <group
            position={[-148.9, -327.36, -301.46]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube037_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[338.23, -498.27, 297.67]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Plane002_Sock1_0.geometry}
              material={materials.Sock1}
            />
            <mesh
              geometry={nodes.Plane002_Sock2_0.geometry}
              material={materials.Sock2}
            />
          </group>
          <group
            position={[173.16, -495.38, 138.7]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Plane003_Sock1_0.geometry}
              material={materials.Sock1}
            />
            <mesh
              geometry={nodes.Plane003_Sock2_0.geometry}
              material={materials.Sock2}
            />
          </group>
          <group
            position={[-54.93, -388.77, 12.7]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder_Cup_0.geometry}
              material={materials.material_21}
            />
            <mesh
              geometry={nodes.Cylinder_Liquid_0.geometry}
              material={materials.Liquid}
            />
          </group>
          <group
            position={[75.68, -388.77, -21.8]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder001_Cup_0.geometry}
              material={materials.material_21}
            />
            <mesh
              geometry={nodes.Cylinder001_Liquid_0.geometry}
              material={materials.Liquid}
            />
          </group>
          <group
            position={[37.16, -396.34, 25.81]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder002_Cup_0.geometry}
              material={materials.material_21}
            />
            <mesh
              geometry={nodes.Cylinder002_Liquid_0.geometry}
              material={materials.Liquid}
            />
          </group>
          <group
            position={[62.92, -388.77, -1.11]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder003_Cup_0.geometry}
              material={materials.material_21}
            />
            <mesh
              geometry={nodes.Cylinder003_Liquid_0.geometry}
              material={materials.Liquid}
            />
          </group>
          <group
            position={[-485.07, 159.59, 156.38]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Plane004_Poster_0.geometry}
              material={materials.Poster}
            />
          </group>
          <group
            position={[-505.74, 156.67, -178.61]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Plane005_Poster_0.geometry}
              material={materials.Poster}
            />
          </group>
          <group
            position={[70.01, -428.41, -332.65]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube050_Material001_0.geometry}
              material={materials["Material.001"]}
            />
            <mesh
              geometry={nodes.Cube050_PizzaBox_0.geometry}
              material={materials.PizzaBox}
            />
          </group>
          <group
            position={[-175.52, -344.83, 321.72]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube051_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[64.48, -340.36, 335.84]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube052_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[17.86, -488.56, 107.98]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube053_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[0, -367.33, 413.77]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Couch001_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-494.04, 351.53, -17.63]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube054_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[386.12, -495.82, -344.1]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder004_Controller_0.geometry}
              material={materials.Controller}
            />
            <mesh
              geometry={nodes.Cylinder004_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[386.19, -143.96, -342.69]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube055_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[108.73, -421.31, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube038_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[114.32, -421.32, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube039_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[119.9, -421.31, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube040_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[125.52, -421.3, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube041_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[130.65, -421.31, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube042_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[136.02, -421.31, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube043_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[141.29, -421.31, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube044_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[146.91, -422.64, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube045_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[152.47, -420.67, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube046_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[158.09, -422.15, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube047_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[163.22, -422.14, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube048_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[168.58, -421.33, -314.27]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube049_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-103.11, -421.31, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube056_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-97.49, -421.3, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube057_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[-92.36, -421.31, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube058_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-86.83, -422.15, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube059_Table_0.geometry}
              material={materials.Table}
            />
          </group>
          <group
            position={[-81.69, -422.14, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube060_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[-73.22, -421.33, -313.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube061_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
          </group>
          <group
            position={[-77.5, -490.74, 29.82]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.LampCable_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[110.89, -323.85, -395.87]}
            rotation={[-Math.PI / 2, -1.35, 0]}
            scale={6.46}
          >
            <mesh
              geometry={nodes.PowerPlug_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-77.5, -490.74, 29.82]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.ControllerCable_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-432.54, -404.19, -11.58]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[0.65, 1.44, 0.76]}>
              <mesh
                geometry={nodes.Cube062_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[0.41, 0.39, 0.51]}>
              <mesh
                geometry={nodes.Cube071_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[0.58, 1.05, 0.58]}>
              <mesh
                geometry={nodes.Cube072_Tissue_0.geometry}
                material={materials.Tissue}
              />
            </group>
            <group position={[0.67, 1, 0.74]}>
              <mesh
                geometry={nodes.Cube073_Couch_0.geometry}
                material={materials.Couch}
              />
            </group>
            <group position={[0.04, 0, 0]}>
              <mesh
                geometry={nodes.Cube063_Drawer2_0.geometry}
                material={materials.Drawer2}
              />
            </group>
            <group position={[0.45, 0, 0]}>
              <mesh
                geometry={nodes.Cube064_Drawer2_0.geometry}
                material={materials.Drawer2}
              />
            </group>
            <group position={[0.68, -0.85, 0.62]}>
              <mesh
                geometry={nodes.Cube065_Cup_0.geometry}
                material={materials.material_21}
              />
            </group>
            <group position={[0.68, -0.85, 0.03]}>
              <mesh
                geometry={nodes.Cube066_1White_0.geometry}
                material={materials["1White"]}
              />
            </group>
            <group position={[0.68, -0.85, -0.6]}>
              <mesh
                geometry={nodes.Cube067_1White_0.geometry}
                material={materials["1White"]}
              />
            </group>
            <group position={[1.09, 0.87, 0.62]}>
              <mesh
                geometry={nodes.Cube068_1White_0.geometry}
                material={materials["1White"]}
              />
            </group>
            <group position={[0.68, 0.87, 0.03]}>
              <mesh
                geometry={nodes.Cube069_1White_0.geometry}
                material={materials["1White"]}
              />
            </group>
            <group position={[0.68, 0.87, -0.6]}>
              <mesh
                geometry={nodes.Cube070_1White_0.geometry}
                material={materials["1White"]}
              />
            </group>
            <mesh
              geometry={nodes.Drawers_CoffeeTable_0.geometry}
              material={materials.CoffeeTable}
            />
          </group>
          <group
            position={[-366.41, -498.06, -367.03]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[-0.45, 0.45, 1.22]}>
              <mesh
                geometry={nodes.Cube074_Material001_0.geometry}
                material={materials["Material.001"]}
              />
            </group>
            <group position={[0.66, -0.61, 3.11]}>
              <mesh
                geometry={nodes.Cube075_Material001_0.geometry}
                material={materials["Material.001"]}
              />
            </group>
            <group position={[-0.45, 0.45, 0.31]}>
              <mesh
                geometry={nodes.Cylinder005_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[0.66, -0.59, 1.28]}>
              <mesh
                geometry={nodes.Cylinder006_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[0.6, -0.31, 0.82]}>
              <mesh
                geometry={nodes.Cube077_Material001_0.geometry}
                material={materials["Material.001"]}
              />
            </group>
            <group position={[-0.45, 0.45, 2.06]}>
              <mesh
                geometry={nodes.Cylinder007_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[0.43, 0.47, 1.11]}>
              <mesh
                geometry={nodes.Cylinder008_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[0.05, 0.26, 2.54]}>
              <mesh
                geometry={nodes.Cube079_Material001_0.geometry}
                material={materials["Material.001"]}
              />
            </group>
            <group position={[-0.75, -0.28, 0.4]}>
              <mesh
                geometry={nodes.Cube078_Material001_0.geometry}
                material={materials["Material.001"]}
              />
            </group>
            <group position={[-0.17, -0.28, 0.4]}>
              <mesh
                geometry={nodes.Cube080_Material001_0.geometry}
                material={materials["Material.001"]}
              />
            </group>
            <group position={[-0.44, -0.44, 0.26]}>
              <mesh
                geometry={nodes.Cube081_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[-0.44, -0.31, 0.4]}>
              <mesh
                geometry={nodes.Cube082_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[-0.44, -0.17, 0.54]}>
              <mesh
                geometry={nodes.Cube083_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[-0.44, -0.03, 0.67]}>
              <mesh
                geometry={nodes.Cube084_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
            </group>
            <group position={[0.27, -0.38, 1.8]}>
              <mesh
                geometry={nodes.Cube085_Material001_0.geometry}
                material={materials["Material.001"]}
              />
            </group>
            <mesh
              geometry={nodes.CatTree_Material001_0.geometry}
              material={materials["Material.001"]}
            />
          </group>
          <group
            position={[-5.19, -399.92, -38.22]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[-0.22, 0.02, 0.05]}>
              <mesh
                geometry={nodes.Cube076__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.02, -0.02, 0.06]}>
              <mesh
                geometry={nodes.Cube086__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.03, 0.01, 0.06]}>
              <mesh
                geometry={nodes.Cube087__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.05, -0.01, 0.06]}>
              <mesh
                geometry={nodes.Cube088__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0, 0, 0.06]}>
              <mesh
                geometry={nodes.Cube089__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.22, 0.02, 0.05]}>
              <mesh
                geometry={nodes.Cube090__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.21, 0.08, -0.02]}>
              <mesh
                geometry={nodes.Cube091__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.21, 0.08, 0.03]}>
              <mesh
                geometry={nodes.Cube092__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.02, 0.05, -0.02]}>
              <mesh
                geometry={nodes.Cube093__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.02, 0.05, 0.03]}>
              <mesh
                geometry={nodes.Cube094__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.07, 0.01, 0.06]}>
              <mesh
                geometry={nodes.Cube095__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.12, 0.01, 0.06]}>
              <mesh
                geometry={nodes.Cube096__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <mesh
              geometry={nodes.Controller_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[104.77, -399.92, 3.34]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[-0.16, -0.15, 0.05]}>
              <mesh
                geometry={nodes.Cube006__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.03, 0, 0.06]}>
              <mesh
                geometry={nodes.Cube097__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.01, 0.03, 0.06]}>
              <mesh
                geometry={nodes.Cube098__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.04, 0.03, 0.06]}>
              <mesh
                geometry={nodes.Cube099__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0, 0, 0.06]}>
              <mesh
                geometry={nodes.Cube100__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.16, -0.15, 0.05]}>
              <mesh
                geometry={nodes.Cube101__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.21, -0.1, -0.02]}>
              <mesh
                geometry={nodes.Cube102__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.21, -0.1, 0.03]}>
              <mesh
                geometry={nodes.Cube103__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.02, 0.05, -0.02]}>
              <mesh
                geometry={nodes.Cube104__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.02, 0.05, 0.03]}>
              <mesh
                geometry={nodes.Cube105__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.06, -0.05, 0.06]}>
              <mesh
                geometry={nodes.Cube106__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.09, -0.08, 0.06]}>
              <mesh
                geometry={nodes.Cube107__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <mesh
              geometry={nodes.Controller001_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[97.77, -492.48, -200.26]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[-0.2, -0.1, 0.05]}>
              <mesh
                geometry={nodes.Cube017__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.03, -0.01, 0.06]}>
              <mesh
                geometry={nodes.Cube108__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.02, 0.03, 0.06]}>
              <mesh
                geometry={nodes.Cube109__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.05, 0.02, 0.06]}>
              <mesh
                geometry={nodes.Cube110__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0, 0, 0.06]}>
              <mesh
                geometry={nodes.Cube111__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.2, -0.1, 0.05]}>
              <mesh
                geometry={nodes.Cube112__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.23, -0.04, -0.02]}>
              <mesh
                geometry={nodes.Cube113__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.23, -0.04, 0.03]}>
              <mesh
                geometry={nodes.Cube114__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.01, 0.06, -0.02]}>
              <mesh
                geometry={nodes.Cube115__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.01, 0.06, 0.03]}>
              <mesh
                geometry={nodes.Cube116__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.07, -0.03, 0.06]}>
              <mesh
                geometry={nodes.Cube117__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.11, -0.05, 0.06]}>
              <mesh
                geometry={nodes.Cube118__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <mesh
              geometry={nodes.Controller002_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[156.61, -324.28, -326.49]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group position={[-0.22, -0.03, 0.05]}>
              <mesh
                geometry={nodes.Cube119__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.03, -0.02, 0.06]}>
              <mesh
                geometry={nodes.Cube120__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.02, 0.02, 0.06]}>
              <mesh
                geometry={nodes.Cube121__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.05, 0, 0.06]}>
              <mesh
                geometry={nodes.Cube122__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0, 0, 0.06]}>
              <mesh
                geometry={nodes.Cube123__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.22, -0.03, 0.05]}>
              <mesh
                geometry={nodes.Cube124__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.23, 0.03, -0.02]}>
              <mesh
                geometry={nodes.Cube125__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.23, 0.03, 0.03]}>
              <mesh
                geometry={nodes.Cube126__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.01, 0.06, -0.02]}>
              <mesh
                geometry={nodes.Cube127__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[0.01, 0.06, 0.03]}>
              <mesh
                geometry={nodes.Cube128__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.07, -0.01, 0.06]}>
              <mesh
                geometry={nodes.Cube129__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <group position={[-0.12, -0.01, 0.06]}>
              <mesh
                geometry={nodes.Cube130__0.geometry}
                material={materials["Cube.076__0"]}
              />
            </group>
            <mesh
              geometry={nodes.Controller003_Controller_0.geometry}
              material={materials.Controller}
            />
          </group>
          <group
            position={[-469.86, -282.73, 100.17]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={23.73}
          >
            <mesh
              geometry={nodes.Pot_CoffeeTableLegs_0.geometry}
              material={materials.CoffeeTableLegs}
            />
            <mesh
              geometry={nodes.Pot_PizzaBox_0.geometry}
              material={materials.PizzaBox}
            />
          </group>
          <group
            position={[-498.95, -478.45, -22.75]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[-498.95, 477.26, -22.75]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube018_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[-22.69, -478.45, -500.83]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube131_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[-22.69, 477.26, -500.83]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube132_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[-470.67, -252.04, 100.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube133_Cactus_0.geometry}
              material={materials.Cactus}
            />
          </group>
          <group
            position={[-454.48, -304.75, -79.92]}
            rotation={[0.02, -0.75, 3.11]}
            scale={19.91}
          >
            <group
              position={[-0.22, -1.57, -0.22]}
              rotation={[1.39, 0.34, -1.02]}
              scale={[1.54, 0.33, 1.54]}
            >
              <mesh
                geometry={nodes.Cube134_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
              <mesh
                geometry={nodes.Cube134_Poster1_0.geometry}
                material={materials.Poster1}
              />
            </group>
            <mesh
              geometry={nodes.PhotoFrame__0.geometry}
              material={materials["Cube.076__0"]}
            />
          </group>
          <group
            position={[-436.48, -304.72, -129.14]}
            rotation={[0.03, -0.53, 3.12]}
            scale={10.58}
          >
            <group
              position={[-0.22, -1.57, -0.22]}
              rotation={[1.39, 0.34, -1.02]}
              scale={[1.54, 0.33, 1.54]}
            >
              <mesh
                geometry={nodes.Cube135_CoffeeTableLegs_0.geometry}
                material={materials.CoffeeTableLegs}
              />
              <mesh
                geometry={nodes.Cube135_Poster3_0.geometry}
                material={materials.Poster3}
              />
            </group>
            <mesh
              geometry={nodes.PhotoFrame001__0.geometry}
              material={materials["Cube.076__0"]}
            />
          </group>
          <group
            position={[-435.89, -292.75, 131]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube136_Poster4_0.geometry}
              material={materials.Poster4}
            />
            <mesh
              geometry={nodes.Cube136_Tissue_0.geometry}
              material={materials.Tissue}
            />
          </group>
          <group
            position={[-412.87, -294.2, 142.35]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder009_PizzaBox_0.geometry}
              material={materials.PizzaBox}
            />
          </group>
          <group
            position={[-404.81, -457.83, 260.85]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder011_Table_0.geometry}
              material={materials.Table}
            />
            <mesh
              geometry={nodes.Cylinder011_Poster4_0.geometry}
              material={materials.Poster4}
            />
            <mesh
              geometry={nodes.Cylinder011_Poster2_0.geometry}
              material={materials.Poster2}
            />
            <mesh
              geometry={nodes.Cylinder011_Poster1_0.geometry}
              material={materials.Poster1}
            />
          </group>
          <group
            position={[-420.11, -451.43, 244.43]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder012_PizzaBox_0.geometry}
              material={materials.PizzaBox}
            />
          </group>
          <group
            position={[-415.24, -445.48, 259.37]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder013_PizzaBox_0.geometry}
              material={materials.PizzaBox}
            />
          </group>
          <group
            position={[94.89, -400.59, 9.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Vert001_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[88.81, -491.07, -196.26]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Vert002_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[146.12, -321.05, -326.34]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Vert005_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-80.37, -435.94, -433.21]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube137_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-109.93, -427.74, -419.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube138_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-97.3, -427.74, -425.36]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube139_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-84.35, -427.74, -431.37]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube140_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
          <group
            position={[-69.57, -427.74, -438.23]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cube141_1White_0.geometry}
              material={materials["1White"]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(modelUrl);
