import { Object3D, PerspectiveCamera, Box3, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/*
  Move camera to fit the object in the center of the canvas
  ref: https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/
*/
export function fitCameraToCenteredObject(
  camera: PerspectiveCamera,
  object: Object3D,
  orbitControls: OrbitControls
) {
  const boundingBox = new Box3();
  boundingBox.setFromObject(object);

  const size = new Vector3();
  boundingBox.getSize(size);

  // figure out how to fit the box in the view:
  // 1. figure out horizontal FOV (on non-1.0 aspects)
  // 2. figure out distance from the object in X and Y planes
  // 3. select the max distance (to fit both sides in)
  //
  // The reason is as follows:
  //
  // Imagine a bounding box (BB) is centered at (0,0,0).
  // Camera has vertical FOV (camera.fov) and horizontal FOV
  // (camera.fov scaled by aspect, see fovh below)
  //
  // Therefore if you want to put the entire object into the field of view,
  // you have to compute the distance as: z/2 (half of Z size of the BB
  // protruding towards us) plus for both X and Y size of BB you have to
  // figure out the distance created by the appropriate FOV.
  //
  // The FOV is always a triangle:
  //
  //  (size/2)
  // +--------+
  // |       /
  // |      /
  // |     /
  // | F° /
  // |   /
  // |  /
  // | /
  // |/
  //
  // F° is half of respective FOV, so to compute the distance (the length
  // of the straight line) one has to: `size/2 / Math.tan(F)`.
  //
  // FTR, from https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  // the camera.fov is the vertical FOV.

  const fov = camera.fov * (Math.PI / 180);
  const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
  const dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
  const dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
  const cameraZ = Math.max(dx, dy);

  camera.position.setZ(cameraZ);
  // set the far plane of the camera so that it easily encompasses the whole object
  const minZ = boundingBox.min.z;
  const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

  camera.far = cameraToFarEdge * 3;
  camera.updateProjectionMatrix();

  // set camera to rotate around the center
  orbitControls.target = new Vector3(0, 0, 0);

  // prevent camera from zooming out far enough to create far plane cutoff
  orbitControls.maxDistance = cameraToFarEdge * 2;
}
