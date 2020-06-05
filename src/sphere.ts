import Vector from './vector';
import Intersection from './intersection';
import Ray from './ray';

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
    this.center;
    // Von allen anderen Vektoren Center abziehen um Center zum Mittelpunkt zu machen und Forml anzeigen zu können
    var new_ray_origin = ray.origin.sub(this.center);
    var discriminant  = Math.pow(new_ray_origin.dot(ray.direction), 2) - new_ray_origin.dot(new_ray_origin) + this.radius* this.radius;
    if(discriminant > 0 ){
      var t1 = -new_ray_origin.dot(ray.direction) + Math.sqrt(discriminant);
      var t2 = -new_ray_origin.dot(ray.direction) - Math.sqrt(discriminant);
      // Check wich intersection is closer
      var result  = t1 < t2 ?  t1 : t2 ;
      var intersectionPoint = ray.origin.add(ray.direction.mul(result));
      var normal = intersectionPoint.sub(this.center);
      return new Intersection(result, intersectionPoint, normal.normalised());
    }
    else if(discriminant === 0 ){
      var t1 = -new_ray_origin.dot(ray.direction) + Math.sqrt(discriminant);
      var result = t1;
      var intersectionPoint = ray.origin.add(ray.direction.mul(result));
      // The normal of the intersectionPoint is the Vektor from Center of the orb to the intersection Point C => IP == IP - C. Taking the ray normal does not make sense, since the ray is not used anymore
      var normal  = intersectionPoint.sub(this.center);
      return new Intersection(result, intersectionPoint, normal.normalised()); 
    }
    else{
      return null;
    }
  }
}