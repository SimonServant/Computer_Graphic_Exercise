//import { dir } from 'node:console';
import Vector from './vector';

/**
 * Class representing a ray
 */
export default class Ray {
  /**
   * Creates a new ray with origin and direction
   * @param origin The origin of the Ray
   * @param direction The direction of the Ray
   */
  constructor(public origin: Vector, public direction: Vector) { }

  /**
   * Creates a ray from the camera through the image plane.
   * @param x The pixel's x-position in the canvas
   * @param y The pixel's y-position in the canvas
   * @param camera The Camera
   * @return The resulting Ray
   */
  static makeRay(x: number, y: number,
    camera: { width: number, height: number, alpha: number }
  ): Ray {
    
    var x_dir = x - (camera.width - 1) / 2
    var y_dir = (camera.height - 1) / 2 - y
    var z_dir = - (camera.width / 2) / Math.tan(camera.alpha / 2)

    var direction = new Vector(x_dir, y_dir, z_dir, 0);
    direction.normalize()

    var origin = new Vector(0, 0, 0, 1);

    return new Ray(origin, direction);

  }
}