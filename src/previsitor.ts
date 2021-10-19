import Matrix from './matrix';
import Vector from './vector';
import Sphere from './sphere';
import Intersection from './intersection';
import Ray from './ray';
import Visitor from './visitor';
import phong from './phong';
import {
    Node, GroupNode, SphereNode,
    AABoxNode, TextureBoxNode, CameraNode, LightNode
  } from './nodes';
  import AABox from './aabox';

/**
 * This class is made for the search of lights and cameras
 */
// TODO: implement the search for lights -> visitLightNode
export default class PreVisitor implements Visitor {

  // declare instance variables 

  // holds the inverse transformation matrix of the camera and the light
  cameraMatrix: Matrix;
  lightMatrices: Matrix[];

  // variables for the stacking of matrices 
  matrixStack: Matrix[];
  matrixStackInverse: Matrix[];

  intersection: Intersection | null;
  intersectionColor: Vector;
  ray: Ray;

  constructor() {
    this.matrixStack = [];
    this.matrixStackInverse = [];
    this.lightMatrices = [];
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
    
    // left empty intentionelly

  }

  /**
 * Visits an axis aligned box node
 * @param node The node to visit
 */
  visitAABoxNode(node: AABoxNode) {

  // left empty intentionelly

  }

  /**
   * Visits a textured box node
   * @param node The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) { 

    // left empty intentionelly

  }


  getInverseCameraMatrix(): Matrix{
    return this.cameraMatrix;
  }

  /**
   * This function resets and initializes the lists containing the matrices with each a identity matrix
   */
  initMatrixLists(){
    this.matrixStackInverse = [Matrix.identity()];
    this.matrixStack = [Matrix.identity()];

  }
  visitCameraNode(node: CameraNode){

    // if a camera node is found - store the inverse transformation matrix at this point

    this.cameraMatrix = this.matrixStackInverse[this.matrixStackInverse.length - 1];
  }

  
  getLightTransformations(): Matrix[]{

    return this.lightMatrices;

  }

  visitLightNode(node: LightNode){

    // store the matrices for the lights and let them be retrievable
    this.lightMatrices.push(this.matrixStack[this.matrixStack.length - 1]);
  }
}