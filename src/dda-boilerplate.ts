import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import { dda } from './dda';

let canvasDDA: HTMLCanvasElement;
let ctxDDA: CanvasRenderingContext2D;
let imageDataDDA: ImageData;

function updateDDA(
    pointA: [number, number],
    pointB: [number, number]
) {
    const data = imageDataDDA.data;
    data.fill(0);
    dda(data, pointA, pointB, canvasDDA.width, canvasDDA.height);
    ctxDDA.putImageData(imageDataDDA, 0, 0);
}

let canvasExample: HTMLCanvasElement;
let ctxExample: CanvasRenderingContext2D;

function updateExample(
    pointA: [number, number],
    pointB: [number, number]
) {
    ctxExample.clearRect(0, 0, canvasExample.width, canvasExample.height);
    ctxExample.beginPath();
    ctxExample.moveTo(pointA[0], pointA[1]);
    ctxExample.lineTo(pointB[0], pointB[1]);
    ctxExample.stroke();
}

let t = 0;

function calculatePoints(t: number): [[number, number], [number, number]] {
    const pointA = [
        Math.round((Math.cos(t) + 1) / 2 * canvasDDA.width),
        Math.round((Math.sin(t) + 1) / 2 * canvasDDA.height)
    ] as [number, number];
    const pointB = [
        Math.round((Math.cos(t + Math.PI) + 1) / 2 * canvasDDA.width),
        Math.round((Math.sin(t + Math.PI) + 1) / 2 * canvasDDA.height)
    ] as [number, number];
    return [pointA, pointB];
}

function updateCanvas(timestamp: number) {
    t += 0.01;
    const points = calculatePoints(t);
    updateExample(points[0], points[1]);
    updateDDA(points[0], points[1]);
    window.requestAnimationFrame(updateCanvas);
}

window.addEventListener('load', evt => {
    canvasDDA = document.getElementById("dda") as HTMLCanvasElement;
    ctxDDA = canvasDDA.getContext("2d");
    imageDataDDA = ctxDDA.getImageData(0, 0, canvasDDA.width, canvasDDA.height);

    canvasExample = document.getElementById("example") as HTMLCanvasElement;
    canvasExample.height = canvasExample.width;
    ctxExample = canvasExample.getContext("2d");

    window.requestAnimationFrame(updateCanvas);
});