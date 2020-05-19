/**
 * Convert the colour information of the pixel at (x, y) to grayscale by using the
 * Y coordinate of the XYZ colour space.
 * 
 * @param x The x coordinate of the pixel to convert
 * @param y The y coordinate of the pixel to convert
 * @param source The source image data
 * @param target The image data to save the converted colour information to
 * @param width The width of the canvas
 * @param height The height of the canvas
 */
export function convertBW(x: number, y: number, source: Uint8ClampedArray, target: Uint8ClampedArray, width: number, height: number) {
    // TODO
}

/**
 * Posterise the source image and save the result in the target image.
 * Restrict the amount of used brightness levels to four equidistant values. 
 * 
 * @param x The x coordinate of the pixel to posterise
 * @param y The y coordinate of the pixel to posterise
 * @param source The source image data
 * @param target The image data to save the converted colour information to
 * @param width The width of the canvas
 * @param height The height of the canvas
 */
export function quantiseBW(x: number, y: number, source: Uint8ClampedArray, target: Uint8ClampedArray, width: number, height: number) {
    // TODO
}

/**
 * Posterise the source image and save the result in the target image.
 * Restrict each colour channel to four equidistant values.
 * 
 * @param x The x coordinate of the pixel to posterise
 * @param y The y coordinate of the pixel to posterise
 * @param source The source image data
 * @param target The image data to save the converted colour information to
 * @param width The width of the canvas
 * @param height The height of the canvas
 */
export function quantiseColour(x: number, y: number, source: Uint8ClampedArray, target: Uint8ClampedArray, width: number, height: number) {
    // TODO
}

/**
 * Calculate how often each value for every colour channel occurs.
 * 
 * @param source The source image data
 * @param width The width of the canvas
 * @param height The height of the canvas
 */
export function calculateHistogram(source: Uint8ClampedArray, width: number, height: number): { r: number[], g: number[], b: number[] } {
    const hist = {
        r: new Array(256),
        g: new Array(256),
        b: new Array(256)
    };
    hist.r.fill(0);
    hist.g.fill(0);
    hist.b.fill(0);
    // TODO
    return hist;
}

/**
 * Posterise the source image and save the result in the target image.
 * Restrict each colour channel to four values. Use the histogram to 
 * choose the quanisation thresholds to have the same amount of samples
 * in each encoded value.
 * 
 * @param histogram The histogram of the image
 * @param source The source image data
 * @param target The image data to save the converted colour information to
 * @param width The width of the canvas
 * @param height The height of the canvas
 * @param valuesPerChannel The number of values per colour channel to restrict to
 */
export function quantiseColourAdaptive(
    histogram: { r: number[], g: number[], b: number[] },
    source: Uint8ClampedArray,
    target: Uint8ClampedArray,
    width: number,
    height: number,
    valuesPerChannel: number
) {
    // TODO
}

/**
 * Construct a KD tree in the used colour space. Then 
 * use it to posterise the source image data and save the result
 * in the target image data.
 * 
 * @param source The source image data
 * @param target The image data to save the converted colour information to
 * @param width The width of the canvas
 * @param height The height of the canvas
 * @param depth How depth of the KD tree to create
 */
export function quantiseKD(
    source: Uint8ClampedArray,
    target: Uint8ClampedArray,
    width: number,
    height: number,
    depth: number
) {
    // TODO
}