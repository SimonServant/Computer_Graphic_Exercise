import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Intersection from './intersection';
import Ray from './ray';
import phong from './phong';
import Sphere from './sphere';
import Vector from './vector';
import Matrix from './matrix';

window.addEventListener('load', () => {
    const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const objects = [
        new Sphere(new Vector(.5, -.2, -2, 1), 0.4, new Vector(.3, 0, 0, 1)),
        new Sphere(new Vector(-.5, -.2, -1.5, 1), 0.4, new Vector(0, 0, .3, 1))
    ];
    const lightPositions = [
        new Vector(1, 1, -1, 1)
    ];
    const shininess = 10;
    const camera = {
        origin: new Vector(0, 0, 0, 1),
        width: canvas.width,
        height: canvas.height,
        alpha: Math.PI / 3
    }

    function setPixel(x: number, y: number, color: Vector) {
        data[4 * (canvas.width * y + x) + 0] = Math.min(255, color.r * 255);
        data[4 * (canvas.width * y + x) + 1] = Math.min(255, color.g * 255);
        data[4 * (canvas.width * y + x) + 2] = Math.min(255, color.b * 255);
        data[4 * (canvas.width * y + x) + 3] = Math.min(255, color.a * 255);
    }

    let rotation = Matrix.identity();
    let translation = Matrix.identity();
    let scale = Matrix.identity();

    console.log("rotation: ")
    rotation.print();
    
    console.log("translation: ")
    translation.print();
    
    console.log("scale: ")
    scale.print();

    console.log("matrixmultiplication: ")
    var matrixmultiplication = rotation.mul(scale);
    console.log("matrixmultiplication result: ")
    matrixmultiplication.print();
    
    var test = 0;

    function animate() {
        data.fill(0);
        let manipulatedObjects = [];
        for (let obj of objects) {
            manipulatedObjects.push(
                new Sphere(
                    rotation.mul(scale).mul(translation).mul(obj.center),
                    obj.radius, obj.color
                )
            );
        }
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                const ray = Ray.makeRay(x, y, camera);
                let minIntersection = new Intersection(Infinity, null, null);
                let minObj = null;
                for (let shape of manipulatedObjects) {
                    const intersection = shape.intersect(ray);
                    if (intersection && intersection.closerThan(minIntersection)) {
                        minIntersection = intersection;
                        minObj = shape;
                    }
                }
                if (minObj) {
                    if (!minObj.color) {
                        setPixel(x, y, new Vector(0, 0, 0, 1));
                    } else {
                        const color = phong(minObj.color, minIntersection, lightPositions, shininess, camera.origin);
                        setPixel(x, y, color);
                    }

                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
    window.requestAnimationFrame(animate);

    const useRotationElement = document.getElementById("userotation") as HTMLInputElement;
    useRotationElement.onchange = () => {
        let range = document.getElementById("rotation") as HTMLInputElement;
        if (useRotationElement.checked) {
            range.oninput = () => {
                rotation = Matrix.rotation(new Vector(0, 0, 1, 0),
                    Number(range.value));
                window.requestAnimationFrame(animate);
            }
            range.disabled = false;
            range.oninput(new Event("click"));
        } else {
            range.disabled = true;
            rotation = Matrix.identity();
        }
        window.requestAnimationFrame(animate);
    }

    const useTranslationElement = document.getElementById("usetranslation") as HTMLInputElement;
    useTranslationElement.onchange = () => {
        let range = document.getElementById("translation") as HTMLInputElement;
        if (useTranslationElement.checked) {
            range.oninput = () => {
                translation = Matrix.translation(new Vector(Number(range.value), 0, 0, 0));
                window.requestAnimationFrame(animate);
            }
            range.disabled = false;
            range.oninput(new Event("click"));
        } else {
            range.disabled = true;
            translation = Matrix.identity();
        }
        window.requestAnimationFrame(animate);
    }

    const useScaleElement = document.getElementById("usescale") as HTMLInputElement;
    useScaleElement.onchange = () => {
        let range = document.getElementById("scale") as HTMLInputElement;
        if (useScaleElement.checked) {
            range.oninput = () => {
                scale = Matrix.scaling(new Vector(
                    Number(range.value),
                    Number(range.value),
                    Number(range.value), 0));
                window.requestAnimationFrame(animate);
            }
            range.disabled = false;
            range.oninput(new Event("click"));
        } else {
            range.disabled = true;
            scale = Matrix.identity();
        }
        window.requestAnimationFrame(animate);
    }

    const sliders = ["rotation", "translation", "scale"];
    for (let t of sliders) {
        const elem = document.getElementById("use" + t) as HTMLInputElement;
        if (elem.checked) {
            elem.onchange(new Event("click"));
        }
    }
});