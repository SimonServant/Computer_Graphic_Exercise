import RasterSphere from './raster-sphere';
import RasterBox from './raster-box';
import RasterTextureBox from './raster-texture-box';
import Vector from './vector';
import Matrix from './matrix';
import Visitor from './visitor';
import PreVisitor from './previsitor';

import {
  Node, GroupNode,
  SphereNode, AABoxNode,
  TextureBoxNode, LightNode, CameraNode
} from './nodes';
import Shader from './shader';

interface Camera {
  eye: Vector,
  center: Vector,
  up: Vector,
  fovy: number,
  aspect: number,
  near: number,
  far: number
}

interface Renderable {
  render(shader: Shader): void;
}

/**
 * Class representing a Visitor that uses Rasterisation 
 * to render a Scenegraph
 */
export class RasterVisitor implements Visitor {

  // TODO declare instance variables here

  matrixStack: Matrix[];
  matrixStackInverse: Matrix[];

  // object which is initiated by the call of the constructor
  preVisitor: PreVisitor;
  
  /**
   * Creates a new RasterVisitor
   * @param gl The 3D context to render to
   * @param shader The default shader to use
   * @param textureshader The texture shader to use
   */
  constructor(
    private gl: WebGL2RenderingContext,
    private shader: Shader,
    private textureshader: Shader,
    private renderables: WeakMap<Node, Renderable>
  ) {
    // TODO setup
    this.matrixStack = [Matrix.identity()];
    this.matrixStackInverse = [Matrix.identity()];
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
    camera: Camera | null,
    lightPositions: Array<Vector>
  ) {

    // TODO: manipulate the camera and lightpositions by using an extra visitor
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

    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    if (camera) {
      this.setupCamera(camera);
    }

    // traverse and render
    rootNode.accept(this);
  }

  /**
   * The view matrix to transform vertices from
   * the world coordinate system to the 
   * view coordinate system
   */
  private lookat: Matrix;

  /**
   * The perspective matrix to transform vertices from
   * the view coordinate system to the 
   * normalized device coordinate system
   */
  private perspective: Matrix;

  /**
   * Helper function to setup camera matrices
   * @param camera The camera used
   */
  setupCamera(camera: Camera) {
    this.lookat = Matrix.lookat(
      camera.eye,
      camera.center,
      camera.up);

    this.perspective = Matrix.perspective(
      camera.fovy,
      camera.aspect,
      camera.near,
      camera.far);
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {

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
   * @param node The node to visit
   */
  visitSphereNode(node: SphereNode) {
    const shader = this.shader;
    shader.use();
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();
    
    //  Calculate the model matrix for the sphere
    toWorld = this.matrixStack[this.matrixStack.length - 1];
    fromWorld = this.matrixStackInverse[this.matrixStackInverse.length - 1];

    //  computing the normal matrix
    var N = fromWorld.transpose();
    N.setVal(0, 3, 0);
    N.setVal(1, 3, 0);
    N.setVal(2, 3, 0);
    N.setVal(3, 0, 0);
    N.setVal(3, 1, 0);
    N.setVal(3, 2, 0);
      
    shader.getUniformMatrix("M").set(toWorld);

    const V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    const P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    // TODO set the normal matrix
    shader.getUniformMatrix("N").set(N);  

    this.renderables.get(node).render(shader);
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    this.shader.use();
    let shader = this.shader;
    let toWorld = Matrix.identity();

    // TODO Calculate the model matrix for the box
    toWorld = this.matrixStack[this.matrixStack.length - 1];

    shader.getUniformMatrix("M").set(toWorld);
    
    let V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }

    this.renderables.get(node).render(shader);
  }

  /**
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.textureshader.use();
    let shader = this.textureshader;

    // calculate the model matrix for the box
    let toWorld = this.matrixStack[this.matrixStack.length - 1];

    shader.getUniformMatrix("M").set(toWorld);

    let P = shader.getUniformMatrix("P");
    
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    shader.getUniformMatrix("V").set(this.lookat);

    this.renderables.get(node).render(shader);
  }

  visitCameraNode(node: CameraNode){

    // left empty intentionally

  }

  visitLightNode(node: LightNode){

    // left empty intentionally

  }
}

/** 
 * Class representing a Visitor that sets up buffers 
 * for use by the RasterVisitor 
 * */
export class RasterSetupVisitor {
  /**
   * The created render objects
   */
  public objects: WeakMap<Node, Renderable>

  /**
   * Creates a new RasterSetupVisitor
   * @param context The 3D context in which to create buffers
   */
  constructor(private gl: WebGL2RenderingContext) {
    this.objects = new WeakMap();
  }

  /**
   * Sets up all needed buffers
   * @param rootNode The root node of the Scenegraph
   */
  setup(rootNode: Node) {
    // Clear to white, fully opaque
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Clear everything
    this.gl.clearDepth(1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);

    rootNode.accept(this);
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
    for (let child of node.children) {
      child.accept(this);
    }
  }

  /**
   * Visits a sphere node
   * @param node - The node to visit
   */
  visitSphereNode(node: SphereNode) {
    this.objects.set(
      node,
      new RasterSphere(this.gl, new Vector(0, 0, 0, 1), 1, node.color)
    );
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    this.objects.set(
      node,
      new RasterBox(
        this.gl,
        new Vector(-0.5, -0.5, -0.5, 1),
        new Vector(0.5, 0.5, 0.5, 1)
      )
    );
  }

  /**
   * Visits a textured box node. Loads the texture
   * and creates a uv coordinate buffer
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.objects.set(
      node,
      new RasterTextureBox(
        this.gl,
        new Vector(-0.5, -0.5, -0.5, 1),
        new Vector(0.5, 0.5, 0.5, 1),
        node.texture
      )
    );
  }

  visitCameraNode(node: CameraNode){

    // left empty intentionally

  }

  visitLightNode(node: LightNode){

    // left empty intentionally

  }
}