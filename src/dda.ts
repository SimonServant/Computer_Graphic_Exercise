/**
 * Draws a line from pointA to pointB on the canvas
 * with the DDA algorithm.
 * @param  {Array.<number>} data   - The linearised pixel array
 * @param  {Array.<number>} pointA - The start point of the line
 * @param  {Array.<number>} pointB - The end point of the line
 * @param  {number} width          - The width of the canvas
 * @param  {number} height         - The height of the canvas
 */
export function dda(
    data: Uint8ClampedArray,
    pointA: [number, number],
    pointB: [number, number],
    width: number, height: number) {
    const realWidth = width * 4;
    var p1x = Math.round(pointA[0]);
    var p1y = Math.round(pointA[1]);
    var p2x = Math.round(pointB[0]);
    var p2y = Math.round(pointB[1]);

    var dx = (p2x - p1x);
    var dy = (p2y - p1y);
    
    var noOfPointsToPlot = Math.max(Math.abs(dx), Math.abs(dy));
    var xInc = dx/noOfPointsToPlot; 
    var yInc = dy/noOfPointsToPlot; 

    var x = p1x;
    var y = p1y;

    setPixel(p1x, p1y, data, realWidth);
    setPixel(p2x, p2y, data, realWidth);

    for (let index = 1; index < noOfPointsToPlot; index++) {
        x += xInc;
        y += yInc;
        setPixel(Math.floor(x), Math.floor(y), data, realWidth);
    }
}

function setPixel(
    x: number,
    y: number,
    data: Uint8ClampedArray,
    realWidth: number) {
    data[x * 4 + y * realWidth] = 0;
    data[x * 4 + y * realWidth + 1] = 0;
    data[x * 4 + y * realWidth + 2] = 0;
    data[x * 4 + y * realWidth + 3] = 255;
}
