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
    var p1x = Math.round(pointA[0]);
    var p1y = Math.round(pointA[1]);
    var p2x = Math.round(pointB[0]);
    var p2y = Math.round(pointB[1]);

    // Calculate line deltas
    var dx = (p2x - p1x);
    var dy = (p2y - p1y);

    var x = p1x;
    var y = p1y;

    //this is the case when slope(m) < 1
    if (Math.abs(dx) > Math.abs(dy))
    {
        setPixel(x, y, data, realWidth);
        var pk = (2 * Math.abs(dy)) - Math.abs(dx)

        for (let index = 0; index < Math.abs(dx); index++) 
        {
            x = x + 1;
            if(pk < 0)
                pk = pk + (2 * Math.abs(dy));
            else
            {
                y = y + 1;
                pk = pk + (2 * Math.abs(dy)) - (2 * Math.abs(dx));
            }
            setPixel(x, y, data, realWidth);            
        }

    }
    // else
    // {
    //     setPixel(x, y, data, realWidth);
    //     var pk = (2 * Math.abs(dx)) - Math.abs(dy)

    //     for (let index = 0; index < Math.abs(dy); index++) {
    //         y = y + 1;
    //         if(pk < 0)
    //             pk = pk + (2 * Math.abs(dx));
    //         else
    //         {
    //             x = x + 1;
    //             pk = pk + (2 * Math.abs(dx)) - (2 * Math.abs(dy));
    //         }
    //         setPixel(x, y, data, realWidth);            
    //     }
    // }

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