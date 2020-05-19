import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import { cmyk } from './cmyk';

window.addEventListener('load', () => {
    const cmykCanvas = document.getElementById("cmyk") as HTMLCanvasElement;
    let cmykCtx = cmykCanvas.getContext("2d");

    const squirrel = new Image();
    squirrel.onload = () => {
        cmykCtx.drawImage(squirrel, 0, 0, 256, 192);
        cmykSplitImage(cmykCtx);
    };
    squirrel.src = "cmyk.jpg";
});

function cmykSplitImage(cmykCtx: CanvasRenderingContext2D) {
    const orig = cmykCtx.getImageData(0, 0, 256, 192);
    const c = cmykCtx.getImageData(0, 0, orig.width, orig.height);
    const m = cmykCtx.getImageData(0, 0, orig.width, orig.height);
    const y = cmykCtx.getImageData(0, 0, orig.width, orig.height);
    const k = cmykCtx.getImageData(0, 0, orig.width, orig.height);
    for (let width = 0; width < orig.width; width++) {
        for (let height = 0; height < orig.height; height++) {
            cmyk(orig.data, width, height, orig.width, orig.height, c.data, m.data, y.data, k.data);
        }
    }
    cmykCtx.putImageData(c, 0, orig.height);
    cmykCtx.putImageData(m, orig.width, orig.height);
    cmykCtx.putImageData(y, 2 * orig.width, orig.height);
    cmykCtx.putImageData(k, 3 * orig.width, orig.height);
}