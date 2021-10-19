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
    // !snip
    let xstart = pointA[0];
    let ystart = pointA[1];
    let xend = pointB[0];
    let yend = pointB[1];

    // Solution from https://de.wikipedia.org/wiki/Bresenham-Algorithmus

    let tau, pdx, pdy, ddx, ddy, es, el;

    /* Entfernung in beiden Dimensionen berechnen */
    let dx = xend - xstart;
    let dy = yend - ystart;

    /* Vorzeichen des Inkrements bestimmen */
    let incx = Math.sign(dx);
    let incy = Math.sign(dy);
    if (dx < 0) dx = -dx;
    if (dy < 0) dy = -dy;

    /* feststellen, welche Entfernung größer ist */
    if (dx > dy) {
        /* x ist schnelle Richtung */
        pdx = incx;
        pdy = 0; /* pd. ist Parallelschritt */
        ddx = incx;
        ddy = incy; /* dd. ist Diagonalschritt */
        es = dy;
        el = dx; /* Fehlerschritte schnell, langsam */
    } else {
        /* y ist schnelle Richtung */
        pdx = 0;
        pdy = incy; /* pd. ist Parallelschritt */
        ddx = incx;
        ddy = incy; /* dd. ist Diagonalschritt */
        es = dx;
        el = dy; /* Fehlerschritte schnell, langsam */
    }

    /* Initialisierungen vor Schleifenbeginn */
    let x = xstart;
    let y = ystart;
    let err = el / 2;

    data[4 * (width * y + x) + 0] = 0;
    data[4 * (width * y + x) + 1] = 0;
    data[4 * (width * y + x) + 2] = 0;
    data[4 * (width * y + x) + 3] = 255;

    /* Pixel berechnen */
    for (tau = 0; tau < el; ++tau) {
        /* tau zaehlt die Pixel, el ist auch Anzahl */
        /* Aktualisierung Fehlerterm */
        err -= es;
        if (err < 0) {
            /* Fehlerterm wieder positiv (>=0) machen */
            err += el;
            /* Schritt in langsame Richtung, Diagonalschritt */
            x += ddx;
            y += ddy;
        } else {
            /* Schritt in schnelle Richtung, Parallelschritt */
            x += pdx;
            y += pdy;
        }
        data[4 * (width * y + x) + 0] = 0;
        data[4 * (width * y + x) + 1] = 0;
        data[4 * (width * y + x) + 2] = 0;
        data[4 * (width * y + x) + 3] = 255;
    }
    // !snip
}
