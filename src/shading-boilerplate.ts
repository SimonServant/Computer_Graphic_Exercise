import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import Matrix from './matrix';
import {
    GroupNode,
    SphereNode,
    TextureBoxNode
} from './nodes';
import {
    RasterVisitor,
    RasterSetupVisitor
} from './rastervisitor';
import Shader from './shader';
import phongVertexShader from './phong-vertex-shader.glsl';
import phongFragmentShader from './phong-fragment-shader.glsl';
import textureVertexShader from './texture-vertex-shader.glsl';
import textureFragmentShader from './texture-fragment-shader.glsl';

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    // construct scene graph
    const sg = new GroupNode(Matrix.scaling(new Vector(1.4, 1.4, 1.4, 1)).mul(Matrix.translation(new Vector(0, 0, 0.4, 0))));
    const gn0 = new GroupNode(Matrix.rotation(new Vector(0, 0, 0, 0), 0));
    const gn1 = new GroupNode(Matrix.scaling(new Vector(.3, .3, .3, 0)).mul(Matrix.translation(new Vector(1, 0, -1.9, 0))));
    gn0.add(gn1);
    const sphere = new SphereNode(new Vector(.8, .4, .1, 1));
    gn1.add(sphere);
    let gn2 = new GroupNode(Matrix.translation(new Vector(.5, 0, 0, 0)));
    gn0.add(gn2);
    sg.add(gn0);
    const cube = new TextureBoxNode('hci-logo.png');
    gn2.add(cube);

    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl);
    setupVisitor.setup(sg);

    let camera = {
        eye: new Vector(0, 0, 1, 1),
        center: new Vector(0, 0, -1, 1),
        up: new Vector(0, 1, 0, 0),
        fovy: 60,
        aspect: canvas.width / canvas.height,
        near: 0.1,
        far: 100
    };

    const phongShader = new Shader(gl,
        phongVertexShader,
        phongFragmentShader
    );
    const textureShader = new Shader(gl,
        textureVertexShader,
        textureFragmentShader
    );
    const visitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects);

    function animate(timestamp: number) {
        gn0.matrix = Matrix.rotation(new Vector(0, 0, 1, 0), timestamp / 1000);
        gn2.matrix = Matrix.rotation(new Vector(0, 1, 0, 0), timestamp / 1000);
        visitor.render(sg, camera, []);
        window.requestAnimationFrame(animate);
    }

    phongShader.load();
    textureShader.load();
    window.requestAnimationFrame(animate);
});