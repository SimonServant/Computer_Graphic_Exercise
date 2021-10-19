/**
 * Determines the colour of a pixel (x, y) to create
 * a checkerboard pattern and saves it into the data array.
 * The data array holds the linearised pixel data of the target canvas
 * row major. Each pixel is of RGBA format.
 * @param data The linearised pixel array
 * @param x The x coordinate of the pixel
 * @param y The y coordinate of the pixel
 * @param width The width of the canvas
 * @param height The height of the canvas
 */
export function checkerboard(data: Uint8ClampedArray, x: number, y: number, width: number, height: number) {

    var r = computeIndex(x, y, width)
    var g = r + 1
    var b = r + 2
    var a = r + 3
    // for each x and y get the corresponding 4 values for the color
    // set the colors based on the 

    var blockSize = width / 8

    if (Math.floor(x / blockSize) % 2 == Math.floor(y / blockSize) % 2){
        data[r] = 0
        data[g] = 0
        data[b] = 0
        data[a] = 255
    } else {
        data[r] = 0
        data[g] = 0
        data[b] = 0
        data[a] = 0
    }

}
export function computeIndex(x: number, y: number, width: number){

    return x * 4 + 4 * width * y
}

