/**
 * Converts the rgb colour information of the given pixel (x, y) into its cmyk 
 * equivalent. Each component of the computed cmyk representation is then 
 * separately converted back to rgb and saved into its own destination image.
 * @param {Array.<number>} data The source array containing the images 
 *                              colour values
 * @param {number} x The x coordinate of the pixel to adjust
 * @param {number} y The y coordinate of the pixel to adjust
 * @param {number} width The width of the image in pixels
 * @param {number} height The height of the image in pixels
 * @param {Array.<number>} cData Destination array for the c component of the
 *                               cmyk decomposition converted to RGB
 * @param {Array.<number>} mData Destination array for the m component of the
 *                               cmyk decomposition converted to RGB
 * @param {Array.<number>} yData Destination array for the y component of the
 *                               cmyk decomposition converted to RGB
 * @param {Array.<number>} kData Destination array for the k component of the
 *                               cmyk decomposition converted to RGB
 */
export function cmyk(data: Uint8ClampedArray, x: number, y: number, width: number, height: number, cData: Uint8ClampedArray, mData: Uint8ClampedArray, yData: Uint8ClampedArray, kData: Uint8ClampedArray) {
    // TODO
}
