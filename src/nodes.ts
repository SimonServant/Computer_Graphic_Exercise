import Visitor from './visitor';
import Vector from './vector';
import { Transformation } from './transformation';

/**
 * Class representing a Node in a Scenegraph
 */
export class Node {
  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor - The visitor
   */
  accept(visitor: Visitor) { }
}

/**
 * Class representing a GroupNode in the Scenegraph.
 * A GroupNode holds a transformation and is able
 * to have child nodes attached to it.
 * @extends Node
 */
export class GroupNode extends Node {
  // TODO declare instance variables

  // storing all followling nodes
  children: Node[];

  /**
   * Constructor
   * @param mat A matrix describing the node's transformation
   */
  constructor(public transform: Transformation) {
    super();
    this.children = [];
    // TODO
  }

  
  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {

    // the node calls the corresponding function of the visitor
    visitor.visitGroupNode(this)
    

  }

  /**
   * Adds a child node
   * @param childNode The child node to add
   */
  add(childNode: Node) {

    this.children.push(childNode)
  }
}

/**
 * Class representing a Sphere in the Scenegraph
 * @extends Node
 */
export class SphereNode extends Node {

  /**
   * Creates a new Sphere.
   * The sphere is defined around the origin 
   * with radius 1.
   * @param color The colour of the Sphere
   */
  constructor(
    public color: Vector
  ) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    
    // the node calls the corresponding function of the visitor
    visitor.visitSphereNode(this)
  }
}

/**
 * Class representing an Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class AABoxNode extends Node {

  /**
   * Creates an axis aligned box.
   * The box's center is located at the origin
   * with all edges of length 1
   * @param color The colour of the cube
   */
  constructor(public color: Vector) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept(visitor: Visitor) {
    
    // the node calls the corresponding function of the visitor
    visitor.visitAABoxNode(this);
  }
}

/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class TextureBoxNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public texture: string) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    
    // the node calls the corresponding function of the visitor
    visitor.visitTextureBoxNode(this);
  }
}

export class CameraNode extends Node {


  camera: { origin: Vector, width: number, height: number, alpha: number };

  constructor(camera: { origin: Vector, width: number, height: number, alpha: number }){
    super();
    this.camera = camera;
  }

  accept(visitor: Visitor) {
    
    // the node calls the corresponding function of the visitor
    visitor.visitCameraNode(this);
  }
}

export class LightNode extends Node {


  light: Vector;

  constructor(light: Vector){
    super();
    this.light = light;
  }

  accept(visitor: Visitor) {
    
    // the node calls the corresponding function of the visitor
    visitor.visitLightNode(this);
  }
}