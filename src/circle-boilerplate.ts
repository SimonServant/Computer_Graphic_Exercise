import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import { circle } from './circle';

function drawCircle() {
    const canvas = document.getElementById("circle") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const radius = canvas.width / 3;
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            circle(data, x, y, canvas.width, canvas.height, radius);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

window.addEventListener('load', evt => {
    drawCircle();
});