import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import {
    GroupNode,
    SphereNode,
    AABoxNode
} from './nodes';
import {
    RasterVisitor,
    RasterSetupVisitor
} from './rastervisitor';
import Shader from './shader';
import vertexShader from './basic-vertex-shader.glsl';
import fragmentShader from './basic-fragment-shader.glsl';
import { Scaling, Translation } from './transformation';

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    // construct scene graph
    const sg = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    const gn1 = new GroupNode(new Translation(new Vector(.5, .3, 0, 0)));
    sg.add(gn1);
    const gn3 = new GroupNode(new Scaling(new Vector(0.4, 0.3, 0.2, 0)));
    gn1.add(gn3);
    const sphere1 = new SphereNode(new Vector(.8, .4, .1, 1))
    gn3.add(sphere1);
    const gn2 = new GroupNode(new Translation(new Vector(-.2, -0.2, 0, 0)));
    sg.add(gn2);
    const cube = new AABoxNode(
        new Vector(1, 0, 0, 1)
    );
    gn2.add(cube);

    // // add the lights to the graph
    // const lightTransformationNode = new GroupNode(new Translation(new Vector(7, 5, 5, 0)));
    // sg.add(lightTransformationNode);
    // lightTransformationNode.add(new LightNode(lightPositions[0]));

    // // add the camera to the graph
    // const cameraTransformationNode = new GroupNode(new Translation(new Vector(0, 0, 5, 0)));
    // sg.add(cameraTransformationNode);
    // cameraTransformationNode.add(new CameraNode(camera));

    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl);
    setupVisitor.setup(sg);

    const shader = new Shader(gl,
        vertexShader,
        fragmentShader
    );
    // render
    const visitor = new RasterVisitor(gl, shader, null, setupVisitor.objects);
    shader.load();
    visitor.render(sg, null, []);
});