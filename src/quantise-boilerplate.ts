import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import { convertBW, quantiseBW, quantiseColour, calculateHistogram, quantiseColourAdaptive, quantiseKD } from './quantise';

window.addEventListener('load', () => {
    const squirrel = new Image();
    squirrel.onload = quantise;
    squirrel.src = "quantise.jpg";
});

function addCheckButton(id: string, data: Uint8ClampedArray, width: number, height: number) {
    const checkButton = document.getElementById(id) as HTMLButtonElement;
    checkButton.addEventListener("click", () => {
        const check = new Set();
        const checkR = new Set();
        const checkG = new Set();
        const checkB = new Set();
        for (let i = 0; i < width * height; i++) {
            check.add(`${data[i * 4 + 0]}, ${data[i * 4 + 1]}, ${data[i * 4 + 2]}`);
            checkR.add(data[i * 4 + 0]);
            checkG.add(data[i * 4 + 1]);
            checkB.add(data[i * 4 + 2]);
        }
        // alert("Unique colours: " + check.size);
        alert(`Unique colours: ${check.size}\nUnique R: ${checkR.size}\nUnique G: ${checkG.size}\nUnique B: ${checkB.size}`);
        console.log(check);
    });
}

function quantise(evt: Event) {
    const originalCanvas = document.getElementById("quantise") as HTMLCanvasElement;
    const original = originalCanvas.getContext("2d");
    original.drawImage(evt.target as HTMLImageElement, 0, 0, 512, 384);
    const originalData = original.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    addCheckButton("original-unique", originalData.data, originalCanvas.width, originalCanvas.height);

    const bwCanvas = document.getElementById("quantise-bw") as HTMLCanvasElement;
    const bw = bwCanvas.getContext("2d");
    const bwData = bw.getImageData(0, 0, bwCanvas.width, bwCanvas.height);

    for (let x = 0; x < bwCanvas.width; x++) {
        for (let y = 0; y < bwCanvas.height; y++) {
            convertBW(x, y, originalData.data, bwData.data, bwCanvas.width, bwCanvas.height);
        }
    }
    bw.putImageData(bwData, 0, 0);

    const bwQuantiseCanvas = document.getElementById("quantise-bw-poster") as HTMLCanvasElement;
    const bwQuantise = bwQuantiseCanvas.getContext("2d");
    const bwQuantiseData = bwQuantise.getImageData(0, 0, bwQuantiseCanvas.width, bwQuantiseCanvas.height);
    for (let x = 0; x < bwCanvas.width; x++) {
        for (let y = 0; y < bwCanvas.height; y++) {
            quantiseBW(x, y, bwData.data, bwQuantiseData.data, bwCanvas.width, bwCanvas.height);
        }
    }
    bwQuantise.putImageData(bwQuantiseData, 0, 0);
    addCheckButton("quantise-bw-unique", bwQuantiseData.data, bwQuantiseCanvas.width, bwQuantiseCanvas.height);

    const colourQuantiseCanvas = document.getElementById("quantise-colour-poster") as HTMLCanvasElement;
    const colourQuantise = colourQuantiseCanvas.getContext("2d");
    const colourQuantiseData = colourQuantise.getImageData(0, 0, colourQuantiseCanvas.width, colourQuantiseCanvas.height);
    for (let x = 0; x < colourQuantiseCanvas.width; x++) {
        for (let y = 0; y < colourQuantiseCanvas.height; y++) {
            quantiseColour(x, y, originalData.data, colourQuantiseData.data, colourQuantiseCanvas.width, colourQuantiseCanvas.height);
        }
    }
    colourQuantise.putImageData(colourQuantiseData, 0, 0);
    addCheckButton("quantise-colour-unique", colourQuantiseData.data, colourQuantiseCanvas.width, colourQuantiseCanvas.height);

    const hist = calculateHistogram(originalData.data, originalCanvas.width, originalCanvas.height);
    const histSVG = (<unknown>document.getElementById("hist-svg")) as SVGSVGElement;
    const histLines = [
        (<unknown>document.getElementById("hist-r")) as SVGPolylineElement,
        (<unknown>document.getElementById("hist-g")) as SVGPolylineElement,
        (<unknown>document.getElementById("hist-b")) as SVGPolylineElement
    ];
    let maxColour = Math.max(...hist.r, ...hist.g, ...hist.b);
    for (let x = 0; x < 256; x++) {
        for (let colour = 0; colour < 3; colour++) {
            const point = histSVG.createSVGPoint();
            point.x = x / 255;
            point.y = 1 - [hist.r, hist.g, hist.b][colour][x] / maxColour;
            histLines[colour].points.appendItem(point);
        }
    }

    const adaptiveQuantiseCanvas = document.getElementById("quantise-colour-adaptive") as HTMLCanvasElement;
    const adaptiveQuantise = adaptiveQuantiseCanvas.getContext("2d");
    const adaptiveQuantiseData = adaptiveQuantise.getImageData(0, 0, adaptiveQuantiseCanvas.width, adaptiveQuantiseCanvas.height);
    quantiseColourAdaptive(
        hist, originalData.data, adaptiveQuantiseData.data,
        adaptiveQuantiseCanvas.width, adaptiveQuantiseCanvas.height, 4
    );
    adaptiveQuantise.putImageData(adaptiveQuantiseData, 0, 0);
    addCheckButton("quantise-adaptive-unique", adaptiveQuantiseData.data, adaptiveQuantiseCanvas.width, adaptiveQuantiseCanvas.height);

    const kdCanvas = document.getElementById("quantise-kd") as HTMLCanvasElement;
    const kd = kdCanvas.getContext("2d");
    const kdData = kd.getImageData(0, 0, kdCanvas.width, kdCanvas.height);
    quantiseKD(
        originalData.data, kdData.data,
        kdCanvas.width, kdCanvas.height, 6
    );
    kd.putImageData(kdData, 0, 0);
    addCheckButton("quantise-kd-unique", kdData.data, kdCanvas.width, kdCanvas.height);
}