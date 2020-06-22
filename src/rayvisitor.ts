import Matrix from './matrix';
import Vector from './vector';
import Sphere from './sphere';
import Intersection from './intersection';
import Ray from './ray';
import Visitor from './visitor';
import phong from './phong';
import {
  Node, GroupNode, SphereNode,
  AABoxNode, TextureBoxNode
} from './nodes';
import AABox from './aabox';

interface Intersectable {
  intersect(ray: Ray): Intersection | null;
  color?: Vector;
}

/**
 * Class representing a Visitor that uses
 * Raytracing to render a Scenegraph
 */
export default class RayVisitor implements Visitor {
  /**
   * The image data of the context to
   * set individual pixels
   */
  imageData: ImageData;

  /**
   * Gather transformed objects in the scene in this array.
   * This is a simplification for our use case as there is
   * very little geometry in the scene. For more complex use cases,
   * you would transform every ray instead of the objects.
   */
  objects: Array<Intersectable>;

  // TODO declare instance variables here [exercise 8]

  /**
   * Creates a new RayVisitor
   * @param context The 2D context to render to
   * @param width The width of the canvas
   * @param height The height of the canvas
   */
  constructor(
    private context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.imageData = context.getImageData(0, 0, width, height);
    // TODO setup [exercise 8]
  }

  /**
   * Renders the Scenegraph
   * @param rootNode The root node of the Scenegraph
   * @param camera The camera used
   * @param lightPositions The light light positions
   */
  render(
    rootNode: Node,
    camera: { origin: Vector, width: number, height: number, alpha: number },
    lightPositions: Array<Vector>
  ) {
    // clear
    let data = this.imageData.data;
    data.fill(0);
    this.objects = [];

    // build list of render objects
    rootNode.accept(this);

    // raytrace
    const width = this.imageData.width;
    const height = this.imageData.height;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const ray = Ray.makeRay(x, y, camera);

        let minIntersection = new Intersection(Infinity, null, null);
        let minObj = null;
        for (let shape of this.objects) {
          const intersection = shape.intersect(ray);
          if (intersection && intersection.closerThan(minIntersection)) {
            minIntersection = intersection;
            minObj = shape;
          }
        }
        if (minObj) {
          if (!minObj.color) {
            data[4 * (width * y + x) + 0] = 0;
            data[4 * (width * y + x) + 1] = 0;
            data[4 * (width * y + x) + 2] = 0;
            data[4 * (width * y + x) + 3] = 255;
          } else {
            let color = phong(minObj.color, minIntersection, lightPositions, 10, camera.origin);
            data[4 * (width * y + x) + 0] = color.r * 255;
            data[4 * (width * y + x) + 1] = color.g * 255;
            data[4 * (width * y + x) + 2] = color.b * 255;
            data[4 * (width * y + x) + 3] = color.a * 255;
          }
        }
      }
    }
    this.context.putImageData(this.imageData, 0, 0);
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
    // TODO traverse the graph and build the model matrix [exercise 8]
  }

  /**
   * Visits a sphere node
   * @param node - The node to visit
   */
  visitSphereNode(node: SphereNode) {
    let mat = Matrix.identity();
    // TODO use the model matrix [exercise 8]
    this.objects.push(new Sphere(
      mat.mul(new Vector(0, 0, 0, 1)),
      mat.mul((new Vector(1, 1, 1, 0)).normalised()).length,
      node.color));
  }

  /**
   * Visits an axis aligned box node
   * @param node The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    let mat = Matrix.identity();
    // TODO use the model matrix [exercise 8]
    this.objects.push(new AABox(
      mat.mul(new Vector(-0.5, -0.5, -0.5, 1)),
      mat.mul(new Vector(0.5, 0.5, 0.5, 1)),
      node.color
    ));
  }

  /**
   * Visits a textured box node
   * @param node The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) { }
}