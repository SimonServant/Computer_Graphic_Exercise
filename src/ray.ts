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
   * @param xpos The pixel's x-position in the canvas
   * @param ypos The pixel's y-position in the canvas
   * @param camera The Camera
   * @return The resulting Ray
   */
  static makeRay(xpos: number, ypos: number,
    camera: { origin: Vector, width: number, height: number, alpha: number }
  ): Ray {
    
    var x_d = xpos - (camera.width-1)/2;
    var y_d = (camera.height-1)/2 - ypos;
    var z_d = -(camera.width/2) / Math.tan(camera.alpha/2);
    var origin = new Vector(xpos,ypos, 0 , 0 );
    var direction = new Vector(x_d, y_d, z_d, 0).normalised();
    return new Ray(origin, direction);
  }
}