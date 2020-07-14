import RasterSphere from './raster-sphere';
import RasterBox from './raster-box';
import RasterTextureBox from './raster-texture-box';
import Vector from './vector';
import Matrix from './matrix';
import Visitor from './visitor';
import {
  Node, GroupNode,
  SphereNode, AABoxNode,
  TextureBoxNode
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
  matrixStack: Array<Matrix>;

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
    this.matrixStack = [];
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
      camera.far
    );
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
    // TODO
    if(this.matrixStack.length==0){
      this.matrixStack.push(node.matrix)
    }
    else{
      var peek = this.matrixStack[this.matrixStack.length-1]
      var currentTransformation  = peek.mul(node.matrix)
      this.matrixStack.push(currentTransformation)
    }
    node.children.forEach(child => {
      child.accept(this);
    });

    var test = this.matrixStack.pop();

  }

  /**
   * Visits a sphere node
   * @param node The node to visit
   */
  visitSphereNode(node: SphereNode) {
    const shader = this.shader;
    shader.use();
    let mat = Matrix.identity();
    mat = mat.mul(this.matrixStack[this.matrixStack.length-1])
    // TODO [exercise 9] Calculate the model matrix for the sphere
    shader.getUniformMatrix("M").set(mat);

    const V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    const P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    
    const n =  this.lookat.invert().transpose();
    const N = shader.getUniformMatrix("N");
    if (N && n) {
      N.set(n);
    }

    this.renderables.get(node).render(shader);
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    this.shader.use();
    let shader = this.shader;
    let mat = Matrix.identity();
    // TODO  [exercise 9] Calculate the model matrix for the sphere
    mat = mat.mul(this.matrixStack[this.matrixStack.length-1])
    shader.getUniformMatrix("M").set(mat);
    let V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }

    const n =  this.lookat.invert().transpose();
    const N = shader.getUniformMatrix("N");
    if (N && n) {
      N.set(n);
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

    let mat = Matrix.identity();
    // TODO [exercise 9] calculate the model matrix for the box
    mat = mat.mul(this.matrixStack[this.matrixStack.length-1])
    shader.getUniformMatrix("M").set(mat);
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    shader.getUniformMatrix("V").set(this.lookat);
    
    const n =  this.lookat.invert().transpose();
    const N = shader.getUniformMatrix("N");
    if (N && n) {
      N.set(n);
    }
    this.renderables.get(node).render(shader);
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
}