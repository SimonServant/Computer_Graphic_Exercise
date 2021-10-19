import Vector from './vector';
import Intersection from './intersection';
import Sphere from './sphere';
//import { maxHeaderSize } from 'node:http';
/**
 * Calculate the colour of an object at the intersection point according to the Phong Lighting model.
 * @param color The colour of the intersected object
 * @param intersection The intersection information
 * @param lightPositions The light positions
 * @param shininess The shininess parameter of the Phong model
 * @param cameraPosition The position of the camera
 * @return The resulting colour
 */
export default function phong(
  color: Vector, 
  intersection: Intersection,
  lightPositions: Array<Vector>, 
  shininess: number,
  cameraPosition: Vector
): Vector {
  const lightColor = new Vector(0.8, 0.8, 0.8, 0);
  const kA = 0.8;
  const kD = 0.5;
  const kS = 0.5;


  // normal vector of intersection
  var normal = intersection.normal

  // point of intersection
  var interPoint = intersection.point

  // compute vector of the intersection to each of the light sources
  var lightVectors: Vector[] = [];
  
  for (let i = 0; i < lightPositions.length; i++){

    lightVectors.push(lightPositions[i].sub(interPoint).normalize())

  }


  // vector from camera to intersection
  var cameraVector = interPoint.sub(cameraPosition).normalize()
  
  // ambiente lighting
  var ambienteIntensity = 1.0
  var ambiente = color.mul(ambienteIntensity * kA);



  // diffuse lighting
  var diffuse = new Vector(0, 0, 0, 0);
  var diffuseIntensity = 1.0
  for (let i = 0; i < lightVectors.length; i++){

    diffuse = diffuse.add(lightColor.mul(diffuseIntensity * kD * max(0, normal.dot(lightVectors[i]))));

  }


  // specular reflection
  var specular = new Vector(0, 0, 0, 0);
  // vector from the intersection to the viewers eye

  for (let i = 0; i < lightVectors.length; i++){
    
    // compute the vector of the light mirrored at the normal vector
    // r = light - 2 * (light * norm) * norm
    var r = lightVectors[i].sub(normal.mul(2 * lightVectors[i].dot(normal)))

    // add the specular lighting of the current light source to the sum of specular lightings
    specular = specular.add(lightColor.mul(kS * Math.pow(max(0, r.dot(cameraVector)), shininess)));

  }
  // Compute the value of the phong model
  var phong = ambiente.add(diffuse.add(specular))
  
  return phong
}


export function max(value1: number, value2: number){
  //** Returns the bigger of both values */
  if (value1 > value2){
    return value1
  }

  return value2
}