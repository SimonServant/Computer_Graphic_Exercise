import Vector from './vector';
import Intersection from './intersection';
import Ray from './ray';
//import { Dirent } from 'node:fs';
//import { dir } from 'node:console';

/**
 * A class representing a sphere
 */
export default class Sphere {
  /**
   * Creates a new Sphere with center and radius
   * @param center The center of the Sphere
   * @param radius The radius of the Sphere
   * @param color The colour of the Sphere
   */
  constructor(
    public center: Vector,
    public radius: number,
    public color: Vector
  ) { }

  /**
   * Calculates the intersection of the sphere with the given ray
   * @param ray The ray to intersect with
   * @return The intersection if there is one, null if there is none
   */
  intersect(ray: Ray): Intersection | null {
    
    var direction = ray.direction
    var shiftedOrigin = ray.origin.sub(this.center)
    direction.normalize()

    var discriminante = Math.pow(shiftedOrigin.dot(direction), 2) - shiftedOrigin.dot(shiftedOrigin) + Math.pow(this.radius, 2)

    if (discriminante < 0){

      return null

    } else if (discriminante == 0){
      // one intersection

      var t = - ray.origin.dot(ray.direction)

      var intersectPoint = shiftedOrigin.add(ray.direction.mul(t))
      var normal = intersectPoint.sub(this.center).normalize()
      var intersection = new Intersection(t, intersectPoint, normal)

      return intersection

    } else if (discriminante > 0){

      // two intersections

      var t_one = - shiftedOrigin.dot(ray.direction) + Math.sqrt(discriminante)
      var t_two = - shiftedOrigin.dot(ray.direction) - Math.sqrt(discriminante)

      var intersectionPoint = null
      var t = 0

      if (t_one < t_two) {
        // take t_one
        intersectPoint = ray.origin.add(ray.direction.mul(t_one))
        t = t_one
      } else {
        // take t_two
        intersectPoint = ray.origin.add(ray.direction.mul(t_two))
        t = t_two
      }

      var normal = intersectPoint.sub(this.center).normalize()
      var intersection = new Intersection(t, intersectPoint, normal)
      
      return intersection
    }

    return null
  }
}