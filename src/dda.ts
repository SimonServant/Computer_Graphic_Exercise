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
    width: number, height: number
) {


    setPixelBlack(data, pointA[0], pointA[1], width)
    setPixelBlack(data, pointB[0], pointB[1], width)

    var m = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0])

    for (let i = 0; i < Math.abs(pointB[0] - pointA[0]); i++){

        for (let m_it = 0; m_it <= Math.floor(Math.abs(m)); m_it++){

            if (pointA[0] < pointB[0]){
    
                setPixelBlack(data, pointA[0] + i, Math.floor(pointA[1] + i * m + m_it), width)
            
            } else {
                setPixelBlack(data, pointB[0] + i, Math.floor(pointB[1] + i * m + m_it), width)
    
            }
        }
    }



}

export function setPixelBlack(data: Uint8ClampedArray, x: number, y: number, width: number){

    var initPixelPos = computeIndex(x, y, width)

    data[initPixelPos + 0] = 0
    data[initPixelPos + 1] = 0
    data[initPixelPos + 2] = 0
    data[initPixelPos + 3] = 255

}   
export function computeIndex(x: number, y: number, width: number){

    return x * 4 + 4 * width * y
}

