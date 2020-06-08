import Vector from './vector';
import Intersection from './intersection';

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
  color: Vector, intersection: Intersection,
  lightPositions: Array<Vector>, shininess: number,
  cameraPosition: Vector
): Vector {
  const lightColor = new Vector(0.8, 0.8, 0.8, 0); // Light intensity seems to be 0.8 for every color in that. Color is the same => white light of 80 Percent intensity
  // Can this be used to calculate light intensity ? Can we even derive intensity simply by RGB since intensity can be increased by energy spent therefore intensity is not purely rgb


  const kA = 0.8; // Materials ambient reflectivity coefficient
  const kD = 0.5; // Materials diffuse reflectivity coefficient
  const kS = 0.5; // Materials specular reflectivity coefficient
  // Missing ke Materials specular shininess
  const kE = shininess;

  // Berechnung von Vektorgrößen. Gegeben sind n und s. S ist gegeben durch angabe von Licht / Lightposition und P Schnittpunkt ist gegeben durch Intersection Point =>

  // TODO: n = ? Is n Normal Vector of intersection ? No normally not. N Should be vektor from center of Orb to Intersection Point but we got no center here therefore we might have to change stuff

  // s == (P=>S) = S - P
  var s = lightPositions[0].sub(intersection.point);
  // r == s gespiegelt an n => r=d−2(d⋅n)n // r = 
  var r =  s.sub(intersection.normal.mul(s.dot(intersection.normal)).mul(2));
  // Last vektor is V towards the eye therefore =>
  var v = cameraPosition.sub(intersection.point);

  // Ambient Lighting: Lr  =  ka L^a | Right now missing Lr Reflected ambient engery and La fictitious ambient light energy

  // Diffuse Lighting: Ld(ps= Lj max(0, n.dot(s) => Missing Lj = Li(p,wi))

  // Specular Reflection: ks Sum over j Lj max(9, r_j.dot(v)^ke)

  // Tipps implementierung: Normalisierung aller vektoren, Lichtquelle nicht verwenden wenn hinter Surface => n dot s kleiner gleich 0 dann ist Lj auch null

  // TODO [exercise 6]
  return color;
}