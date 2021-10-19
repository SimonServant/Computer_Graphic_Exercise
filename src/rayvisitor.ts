import Matrix from './matrix';
import Vector from './vector';
import Sphere from './sphere';
import Intersection from './intersection';
import Ray from './ray';
import Visitor from './visitor';
import phong from './phong';
import PreVisitor from './previsitor'
import {
  Node, GroupNode, SphereNode,
  AABoxNode, TextureBoxNode, CameraNode, LightNode
} from './nodes';
import AABox from './aabox';

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));

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

  // declare instance variables 

  // variables for the stacking of matrices 
  matrixStack: Matrix[];
  matrixStackInverse: Matrix[];

  intersection: Intersection | null;
  intersectionColor: Vector;
  ray: Ray;

  // object which is initiated by the call of the constructor
  preVisitor: PreVisitor;

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
    this.matrixStack = [];
    this.matrixStackInverse = [];
    this.preVisitor = new PreVisitor();
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

    // raytrace
    const width = this.imageData.width;
    const height = this.imageData.height;
    
    // get transformation of camera
    this.preVisitor.initMatrixLists()
    rootNode.accept(this.preVisitor);
    var cameraInverse = this.preVisitor.getInverseCameraMatrix();
    var lightMatrices = this.preVisitor.getLightTransformations();

    // create a new variable for the light positions so they wont be manipulated for the future
    // ... only manipulated for now
    var newLightPositions = lightPositions;

    // We assume that the positions of the lights found in the graph are in the same order as in the 
    // list of light sources
    // TODO: change positions by giving each light source a name? Or an id?
    for (let i = 0; i < lightPositions.length; i++){
      newLightPositions[i] = lightMatrices[i].mulVec(lightPositions[i]);
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {

        this.ray = Ray.makeRay(x, y, camera);
        this.ray.origin = cameraInverse.mulVec(this.ray.origin);
        this.ray.direction = cameraInverse.mulVec(this.ray.direction);

        // initialize the matrix stack
        this.matrixStack = [Matrix.identity()];
        this.matrixStackInverse = [Matrix.identity()];

        this.intersection = null;
        rootNode.accept(this);

        if (this.intersection) {
          if (!this.intersectionColor) {
            data[4 * (width * y + x) + 0] = 0;
            data[4 * (width * y + x) + 1] = 0;
            data[4 * (width * y + x) + 2] = 0;
            data[4 * (width * y + x) + 3] = 255;
          } else {
            // TODO
            // AUCH HIER DEN ORIGIN VON DER CAMERA ÄNDERN
            let color = phong(this.intersectionColor, this.intersection, newLightPositions, 10, camera.origin);
            data[4 * (width * y + x) + 0] = color.r * 255;
            data[4 * (width * y + x) + 1] = color.g * 255;
            data[4 * (width * y + x) + 2] = color.b * 255;
            data[4 * (width * y + x) + 3] = 255;
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
    // traverse the graph and build the model matrix

    // get the matrix and inverse matrix of the group node, multiply them onto the last element added,
    // and store the result right after the last one

    // save the current position of the last transformation matrix so that we later, after one branch of the 
    // recursive tree is processed, can returnd and continue to process from this location

    // adding  the new transformation matrix to the end of the list of matrices
    this.matrixStack.push(this.matrixStack[this.matrixStack.length - 1].mul(node.transform.getMatrix()));
    this.matrixStackInverse.push(node.transform.getInverseMatrix().mul(this.matrixStackInverse[this.matrixStackInverse.length - 1]));

    // for each of the children of the node accept this visitor
    for(let index = 0; index < node.children.length; index++){
      // update the current index bevor each iteration, such that the later on recursive iterations can start from this index

      node.children[index].accept(this)

    }

    // remove the last computed matrices after finishing this node
    this.matrixStack.pop();
    this.matrixStackInverse.pop();
  }


  /**
   * Visits a sphere node
   * @param node - The node to visit
   */
  visitSphereNode(node: SphereNode) {
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();

    // TODO assign the model matrix and its inverse
    toWorld = toWorld.mul(this.matrixStack[this.matrixStack.length - 1]);
    fromWorld = this.matrixStackInverse[this.matrixStackInverse.length - 1].mul(fromWorld);

    const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
    let intersection = UNIT_SPHERE.intersect(ray);

    if (intersection) {
      const intersectionPointWorld = toWorld.mulVec(intersection.point);
      const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
      intersection = new Intersection(
        (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
        intersectionPointWorld,
        intersectionNormalWorld
      );
      if (this.intersection === null || intersection.closerThan(this.intersection)) {
        this.intersection = intersection;
        this.intersectionColor = node.color;
      }
    }
  }

  /**
   * Visits an axis aligned box node
   * @param node The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();

    // TODO assign the model matrix and its inverse
    toWorld = toWorld.mul(this.matrixStack[this.matrixStack.length - 1]);
    fromWorld = this.matrixStackInverse[this.matrixStackInverse.length - 1].mul(fromWorld);

    const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
    let intersection = UNIT_AABOX.intersect(ray);

    if (intersection) {
      const intersectionPointWorld = toWorld.mulVec(intersection.point);
      const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
      intersection = new Intersection(
        (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
        intersectionPointWorld,
        intersectionNormalWorld
      );
      if (this.intersection === null || intersection.closerThan(this.intersection)) {
        this.intersection = intersection;
        this.intersectionColor = node.color;
      }
    }
  }

  /**
   * Visits a textured box node
   * @param node The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) { }

  visitCameraNode(node: CameraNode){

    // left empty intentionally

  }

  visitLightNode(node: LightNode){

    // left empty intentionally

  }
}

