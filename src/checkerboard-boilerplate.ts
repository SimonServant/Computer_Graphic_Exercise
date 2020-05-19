import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import { checkerboard } from './checkerboard';

function drawCheckerboard() {
    const canvas = document.getElementById("checkerboard") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            checkerboard(data, x, y, canvas.width, canvas.height);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

window.addEventListener('load', evt => {
    drawCheckerboard();
});