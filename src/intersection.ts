import Vector from './vector';

/**
 * Class representing a ray-sphere intersection in 3D space
 */
export default class Intersection {
  /**
   * Create an Intersection
   * @param t The distance on the ray
   * @param point The intersection point
   * @param normal The normal in the intersection
   */
  constructor(public t: number, public point: Vector, public normal: Vector) {
    if (t) {
      this.t = t;
    } else {
      this.t = Infinity;
    }
  }

  /**
   * Determines whether this intersection
   * is closer than the other
   * @param other The other Intersection
   * @return The result
   */
  closerThan(other: Intersection): boolean {
    if (this.t < other.t) return true;
    else return false;
  }
}