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
    const Y =
        0.2126 * source[(y * width + x) * 4 + 0] / 255 +
        0.7139 * source[(y * width + x) * 4 + 1] / 255 +
        0.0733 * source[(y * width + x) * 4 + 2] / 255;
    target[(y * width + x) * 4 + 0] = Y * 255;
    target[(y * width + x) * 4 + 1] = Y * 255;
    target[(y * width + x) * 4 + 2] = Y * 255;
    target[(y * width + x) * 4 + 3] = 255;
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
    const val = Math.floor(source[(y * width + x) * 4] / 256 * 4) / 3 * 255;
    target[(y * width + x) * 4 + 0] = val;
    target[(y * width + x) * 4 + 1] = val;
    target[(y * width + x) * 4 + 2] = val;
    target[(y * width + x) * 4 + 3] = 255;
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
    // !snip
    target[(y * width + x) * 4 + 0] = Math.floor(source[(y * width + x) * 4 + 0] / 256 * 4) / 3 * 255;;
    target[(y * width + x) * 4 + 1] = Math.floor(source[(y * width + x) * 4 + 1] / 256 * 4) / 3 * 255;;
    target[(y * width + x) * 4 + 2] = Math.floor(source[(y * width + x) * 4 + 2] / 256 * 4) / 3 * 255;;
    target[(y * width + x) * 4 + 3] = 255;
    // !snip
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
    // !snip
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            hist.r[source[(y * width + x) * 4 + 0]] += 1;
            hist.g[source[(y * width + x) * 4 + 1]] += 1;
            hist.b[source[(y * width + x) * 4 + 2]] += 1;
        }
    }
    // !snip
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
    // !snip
    // calculate the thresholds where to cut between values
    const thresholds = new Array(3);
    const thresholdValue = new Array(3);
    for (let colour = 0; colour < 3; colour++) {
        thresholds[colour] = new Array(valuesPerChannel);
        // calculate the cumulative density function
        const cdf = new Array(256);
        const hist = [histogram.r, histogram.g, histogram.b][colour];
        cdf[0] = hist[0];
        for (let i = 1; i < 256; i++) {
            cdf[i] = cdf[i - 1] + hist[i];
        }
        for (let i = 0; i < 256; i++) {
            cdf[i] = cdf[i] / cdf[cdf.length - 1];
        }

        // determine the threshold by comparing the
        // values in the cdf to the requested quantiles
        for (let quant = 1; quant < valuesPerChannel; quant++) {
            for (let i = 1; i < 256; i++) {
                if (cdf[i] >= quant / valuesPerChannel) {
                    thresholds[colour][quant - 1] = i - 1;
                    break;
                }
            }
        }
        thresholds[colour][valuesPerChannel - 1] = 255;

        thresholdValue[colour] = new Array(valuesPerChannel);
        thresholdValue[colour][0] = thresholds[colour][0] / 2;
        for (let threshold = 1; threshold < thresholds[colour].length; threshold++) {
            thresholdValue[colour][threshold] = (thresholds[colour][threshold - 1] + thresholds[colour][threshold]) / 2;
        }
    }

    // quantise the image colours
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            for (let colour = 0; colour < 3; colour++) {
                let intensity = source[(y * width + x) * 4 + colour];
                for (let threshold = 0; threshold < thresholds[colour].length; threshold++) {
                    if (intensity <= thresholds[colour][threshold]) {
                        target[(y * width + x) * 4 + colour] = thresholdValue[colour][threshold];
                        break;
                    }
                }
            }
            target[(y * width + x) * 4 + 3] = 255;
        }
    }
    // !snip
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
    // !snip
    let indices = new Uint32Array(width * height);
    for (let i = 0; i < width * height; i++) {
        indices[i] = i * 4;
    }
    class KdTree {
        axis: number;
        threshold: number;
        children: Array<KdTree>;
        color: number[];
    }
    function kd(data: Uint8ClampedArray, indices: Uint32Array, axis: number, depth: number): KdTree {
        const tree = new KdTree;
        tree.axis = axis;
        tree.children = [];
        if (depth === 0) {
            tree.color = [0, 0, 0];
            for (let i = 0; i < indices.length; i++) {
                for (let c = 0; c < 3; c++) {
                    tree.color[c] += data[indices[i] + c] / indices.length;
                }
            }
            return tree;
        }
        const values = new Uint8ClampedArray(indices.length);
        for (let i = 0; i < indices.length; i++) {
            values[i] = data[indices[i] + axis];
        }
        values.sort((a, b) => a - b);
        tree.threshold = values[Math.floor(values.length / 2)];
        const nextAxis = (axis + 1) % 3;
        tree.children = [
            kd(data, indices.filter((i) => data[i + axis] <= tree.threshold), nextAxis, depth - 1),
            kd(data, indices.filter((i) => data[i + axis] > tree.threshold), nextAxis, depth - 1),
        ];
        return tree;
    }
    const tree = kd(source, indices, 0, depth);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let subtree = tree;
            while (subtree.children.length > 0) {
                if (source[(y * width + x) * 4 + subtree.axis] <= subtree.threshold) {
                    subtree = subtree.children[0];
                } else {
                    subtree = subtree.children[1];
                }
            }
            target[(y * width + x) * 4 + 0] = subtree.color[0];
            target[(y * width + x) * 4 + 1] = subtree.color[1];
            target[(y * width + x) * 4 + 2] = subtree.color[2];
            target[(y * width + x) * 4 + 3] = 255;
        }
    }
    // !snip
}