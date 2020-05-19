/**
 * Determines the colour of a pixel (x, y) to create
 * a checkerboard pattern and saves it into the data array.
 * The data array holds the linearised pixel data of the target canvas
 * row major. Each pixel is of RGBA format.
 * @param  {Uint8ClampedArray} data - The linearised pixel array
 * @param  {number} x            - The x coordinate of the pixel
 * @param  {number} y            - The y coordinate of the pixel
 * @param  {number} width        - The width of the canvas
 * @param  {number} height       - The height of the canvas
 */
export function checkerboard(data: Uint8ClampedArray, x: number, y: number, width: number, height: number) {
    const pixelFactor = 4;
    const realWidth = width *4; //1200
    const widthOfOneSquare = width / 8; // one width 150
    const heightOfOneSquare = height / 8; 

    var currentRow = Math.floor(y / heightOfOneSquare); // returns a number 0 means first column of squares and so on. 7 ist the last one. if the solution is 8 we are basically in the last row but that should now happens since we start at 0
    var currentColumn = Math.floor(x/ widthOfOneSquare);

    
    var decider = (currentRow + currentColumn) % 2;


    if(currentRow == 1 && currentColumn == 0){
        console.log("white_ " + decider);
    }

    if(decider == 0){
        data[x * 4 + y * realWidth] = 0;
        data[x * 4 + y * realWidth + 1]= 0;
        data[x * 4 + y * realWidth + 2]= 0;
        data[x * 4 + y * realWidth + 3]= 255;
    }
}