/**
 * Draws a line from pointA to pointB on the canvas
 * with the Bresenham algorithm.
 * @param  {Uint8ClampedArray} data   - The linearised pixel array
 * @param  {[number, number]} pointA - The start point of the line
 * @param  {[number, number]} pointB - The end point of the line
 * @param  {number} width          - The width of the canvas
 * @param  {number} height         - The height of the canvas
 */
export function bresenham(data: Uint8ClampedArray, pointA: [number, number], pointB: [number, number], width: number, height: number) {
    const realWidth = width * 4;
    var p1x = pointA[0];
    var p1y = pointA[1];
    var p2x = pointB[0];
    var p2y = pointB[1];

    // Calculate line deltas
    var dx = Math.abs(p2x - p1x);
    var dy = Math.abs(p2y - p1y);
    
    var sx = p1x < p2x ? 1 : -1;
    var sy = p1y < p2y ? 1 : -1; 

    var err = (dx > dy ? dx : -dy) / 2;
    var error_previous;

    var counter = 300;

    for(;;){
        setPixel(p1x, p1y, data, realWidth);
        if(p1x == p2x && p1y == p2y) {
            break;
        }
        error_previous = err;
        if(error_previous > -dx){
            err -= dy;
            p1x += sx;
        }
        if(error_previous < dy) {
            err += dx;
            p1y += sy;
        }
        counter --;
        if (counter === 0){
            var hansimGlück = 0;
            //break;
        }
    }

    var test = 1;

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