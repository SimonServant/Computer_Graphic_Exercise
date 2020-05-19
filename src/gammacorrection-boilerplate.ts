import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import { gammaAdjust } from './gammacorrection';

let gammaImageData: ImageData;
let gammaCtx: CanvasRenderingContext2D;
let gamma = 1;

window.addEventListener('load', () => {
    const gammaSlider = document.getElementById("gammaslider") as HTMLInputElement;

    const gammaCanvas = document.getElementById("gamma") as HTMLCanvasElement;
    gammaCtx = gammaCanvas.getContext("2d");

    const gammaImg = new Image();
    gammaImg.onload = () => {
        gammaCtx.drawImage(gammaImg, 0, 0);
        gammaImageData = gammaCtx.getImageData(
            0, 0, gammaImg.width, gammaImg.height);
        gammaAdjustImage();
    };
    gammaImg.src = "gamma-correction.png";

    gammaSlider.addEventListener('change', e => {
        gamma = Number(gammaSlider.value);
        gammaAdjustImage();
    });
    gamma = Number(gammaSlider.value);
});

function gammaAdjustImage() {
    const imageData = gammaCtx.getImageData(
        0, 0,
        gammaImageData.width, gammaImageData.height
    );
    for (let width = 0; width < gammaImageData.width; width++) {
        for (let height = 0; height < gammaImageData.height; height++) {
            gammaAdjust(gamma,
                gammaImageData.data, imageData.data,
                width, height,
                gammaImageData.width, gammaImageData.height
            );
        }
    }
    gammaCtx.putImageData(imageData, 0, 0);
}
