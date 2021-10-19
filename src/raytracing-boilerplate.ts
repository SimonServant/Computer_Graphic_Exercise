import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Sphere from './sphere';
import Vector from './vector';
import Ray from './ray';

window.addEventListener('load', evt => {
    const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const sphere = new Sphere(
        new Vector(0, 0, -1, 1),
        0.8,
        new Vector(0, 0, 0, 1)
    );

    const camera = {
        width: canvas.width,
        height: canvas.height,
        alpha: Math.PI * 2 / 3
    }
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const ray = Ray.makeRay(x, y, camera);
            if (sphere.intersect(ray)) {
                data[4 * (canvas.width * y + x) + 3] = 255;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
});