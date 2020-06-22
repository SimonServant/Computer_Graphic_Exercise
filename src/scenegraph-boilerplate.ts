import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import Matrix from './matrix';
import {
    GroupNode,
    SphereNode
} from './nodes';
import RayVisitor from './rayvisitor';

window.addEventListener('load', () => {
    const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const sg = new GroupNode(Matrix.translation(new Vector(-.2, 0, 2, 0)));
    const gn = new GroupNode(Matrix.identity());
    sg.add(gn);
    const gn1 = new GroupNode(Matrix.translation(
        new Vector(.4, 0, -3, 1)
    ).mul(Matrix.scaling(new Vector(0.2, 0.2, 0.2, 0))));
    gn.add(gn1);
    gn1.add(new SphereNode(new Vector(.3, 0, 0, 1)));
    const gn2 = new GroupNode(Matrix.translation(
        new Vector(-.2, 0, -3, 1)
    ).mul(Matrix.scaling(new Vector(0.1, 0.1, 0.1, 0))));
    gn.add(gn2);
    gn2.add(new SphereNode(new Vector(0, 0, .3, 1)));
    const lightPositions = [
        new Vector(1, 1, 1, 1)
    ];
    const camera = {
        origin: new Vector(0, 0, 0, 1),
        width: canvas.width,
        height: canvas.height,
        alpha: Math.PI / 3
    }

    const visitor = new RayVisitor(ctx, canvas.width, canvas.height);

    let animationHandle: number;

    function animate(timestamp: number) {
        gn.matrix.setVal(1, 3, Math.sin(Math.PI * timestamp / 2000) * 0.1);
        gn.matrix.setVal(2, 3, Math.cos(Math.PI * timestamp / 2000) * 0.1);

        visitor.render(sg, camera, lightPositions);
        animationHandle = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationHandle) {
            window.cancelAnimationFrame(animationHandle);
        }
        animationHandle = window.requestAnimationFrame(animate);
    }
    startAnimation();

    document.getElementById("startAnimationBtn").addEventListener(
        "click", startAnimation);
    document.getElementById("stopAnimationBtn").addEventListener(
        "click", () => cancelAnimationFrame(animationHandle));
});