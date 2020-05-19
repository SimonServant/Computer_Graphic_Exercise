/**
 * Conducts a gamma adjustment with a given gamma value on the pixel
 * (x, y). The original colour information can be read from the source image.
 * The adjusted colour is to be saved in the dest array.
 * @param {number} gamma The gamma factor to adjust the brightness
 * @param {Uint8ClampedArray} source The original pixel data
 * @param {Uint8ClampedArray} dest The array to save the adjusted colour data to
 * @param {number} x The x coordinate of the pixel to adjust
 * @param {number} y The y coordinate of the pixel to adjust
 * @param {number} width The width of the image in pixels
 * @param {number} height The height of the image in pixels
 */
export function gammaAdjust(gamma: number, source: Uint8ClampedArray, dest: Uint8ClampedArray, x: number, y: number, width: number, height: number) {


    const n = gamma;

    const position = 4 * (x + y * width);

    const r = position;
    const r_intensity = source[r] / 255;
    const n_r = Math.floor((Math.pow(r_intensity,(1/gamma)))*255);

    const g = position + 1;
    const g_intensity = source[g] / 255;
    const g_r = Math.floor((Math.pow(g_intensity,(1/gamma)))*255)

    const b = position + 2;
    const b_intensity = source[b] / 255;
    const b_r = Math.floor((Math.pow(b_intensity,(1/gamma)))*255)

    dest[r] = n_r;
    dest[g] = g_r;
    dest[b] = b_r;

    if(x ===1 && y ===1){
        console.log("Gamma: " + gamma);
        console.log("R Value right now: " + source[r]);
        console.log("R I: " + r_intensity);
        console.log("Result: " + (Math.pow(r_intensity,(1/gamma))));
        console.log("Destination value: " + dest[r]);
    }

}
