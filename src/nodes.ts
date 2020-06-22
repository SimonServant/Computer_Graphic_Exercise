import Visitor from './visitor';
import Matrix from './matrix';
import Vector from './vector';

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
  public children:Array<Node> = new Array<Node>();
  /**
   * Constructor
   * @param mat A matrix describing the node's transformation
   */
  constructor(public matrix: Matrix) {
    super();
    this.matrix = matrix;
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    visitor.visitGroupNode(this);
  }

  /**
   * Adds a child node
   * @param childNode The child node to add
   */
  add(childNode: Node) {
    this.children.push(childNode);
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
    visitor.visitSphereNode(this);
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
    visitor.visitTextureBoxNode(this);
  }
}