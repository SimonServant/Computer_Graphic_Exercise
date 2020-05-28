import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import { bresenham } from './bresenham';

let canvasExample: HTMLCanvasElement;
let ctxExample: CanvasRenderingContext2D;

function updateExample(pointA: [number, number], pointB: [number, number]) {
    ctxExample.clearRect(0, 0, canvasExample.width, canvasExample.height);
    ctxExample.beginPath();
    ctxExample.moveTo(pointA[0], pointA[1]);
    ctxExample.lineTo(pointB[0], pointB[1]);
    ctxExample.stroke();
}

let canvasBresenham: HTMLCanvasElement;
let ctxBresenham: CanvasRenderingContext2D;
let imageDataBresenham: ImageData;

function updateBresenham(pointA: [number, number], pointB: [number, number]) {
    const data = imageDataBresenham.data;
    data.fill(0);
    bresenham(data, pointA, pointB, canvasBresenham.width, canvasBresenham.height);
    ctxBresenham.putImageData(imageDataBresenham, 0, 0);
}

let t = 0;

function calculatePoints(t: number): [[number, number], [number, number]] {
    const pointA = [
        Math.round((Math.cos(t) + 1) / 2 * canvasBresenham.width),
        Math.round((Math.sin(t) + 1) / 2 * canvasBresenham.height)
    ] as [number, number];
    const pointB = [
        Math.round((Math.cos(t + Math.PI) + 1) / 2 * canvasBresenham.width),
        Math.round((Math.sin(t + Math.PI) + 1) / 2 * canvasBresenham.height)
    ] as [number, number];
    return [pointA, pointB];
}

function updateCanvas(timestamp: number) {
    t += 0.01;
    const points = calculatePoints(t);
    updateExample(points[0], points[1]);
    updateBresenham(points[0], points[1]);
    window.requestAnimationFrame(updateCanvas);
}

window.addEventListener('load', evt => {
    canvasBresenham = document.getElementById("bresenham") as HTMLCanvasElement;
    canvasBresenham.height = canvasBresenham.width;
    ctxBresenham = canvasBresenham.getContext("2d");
    imageDataBresenham = ctxBresenham.getImageData(
        0, 0, canvasBresenham.width, canvasBresenham.height);

    canvasExample = document.getElementById("example") as HTMLCanvasElement;
    canvasExample.height = canvasExample.width;
    ctxExample = canvasExample.getContext("2d");

    window.requestAnimationFrame(updateCanvas);
});