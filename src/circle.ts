/**
 * Determines the colour of a pixel (x, y) to create
 * a circle and saves it into the data array.
 * The data array holds the linearised pixel data of the target canvas
 * row major. Each pixel is of RGBA format.
 * @param data The linearised pixel array
 * @param x The x coordinate of the pixel
 * @param y The y coordinate of the pixel
 * @param width The width of the canvas
 * @param height The height of the canvas
 * @param radius The radius of the circle
 */
export function circle(data: Uint8ClampedArray, x: number, y: number, width: number, height: number, radius: number) {
    // first define the radius you want: 10
    // definiere Punkt in der Mitte: complete widt = 300 => 150:150
    const centerX = 150;
    const centerY = 150;
    const realWidth = width *4; //1200
    var distance_x = centerX - x;
    var distance_y = centerY - y;

    const diameter = 100;

    var distance_to_center = Math.sqrt( distance_x* distance_x + distance_y*distance_y );

    if(distance_to_center < diameter){
        data[x * 4 + y * realWidth] = 0;
        data[x * 4 + y * realWidth + 1]= 0;
        data[x * 4 + y * realWidth + 2]= 0;
        data[x * 4 + y * realWidth + 3]= 255;
    }
}
