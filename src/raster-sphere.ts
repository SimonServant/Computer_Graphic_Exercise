import Vector from './vector';
import Shader from './shader';

/**
 * A class creating buffers for a sphere to render it with WebGL
 */
export default class RasterSphere {
    /**
     * The buffer containing the sphere's vertices
     */
    vertexBuffer: WebGLBuffer;
    /**
     * The indices describing which vertices form a triangle
     */
    indexBuffer: WebGLBuffer;
    /**
     * The normals on the surface at each vertex location
     */
    normalBuffer: WebGLBuffer;

    // TODO private variable for color buffer [exercise 9]
    colorBuffer: WebGLBuffer;

    /**
     * The amount of indices
     */
    elements: number;

    /**
     * Creates all WebGL buffers for the sphere
     * @param gl The canvas' context
     * @param center The center of the sphere
     * @param radius The radius of the sphere
     * @param color The color of the sphere
     */
    constructor(
        private gl: WebGL2RenderingContext,
        center: Vector,
        radius: number,
        color: Vector
    ) {

        let vertices = [];
        let indices = [];
        let normals = [];
        let colors = [];

        let ringsize = 30;
        for (let ring = 0; ring < ringsize; ring++) {
            for (let ring2 = 0; ring2 < ringsize; ring2++) {
                let theta = ring * Math.PI * 2 / ringsize - 1;
                let phi = ring2 * Math.PI * 2 / ringsize;
                let x = (radius *
                    Math.sin(theta) *
                    Math.cos(phi) +
                    center.x
                );
                let y = (radius *
                    Math.sin(theta) *
                    Math.sin(phi) +
                    center.y
                );
                let z = (radius *
                    Math.cos(theta) +
                    center.z
                );
                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                let normal = (new Vector(x, y, z, 1)).sub(center).normalised();
                normals.push(normal.x);
                normals.push(normal.y);
                normals.push(normal.z);
            }
        }

        for (let ring = 0; ring < ringsize - 1; ring++) {
            for (let ring2 = 0; ring2 < ringsize; ring2++) {
                indices.push(ring * ringsize + ring2);
                indices.push((ring + 1) * ringsize + ring2);
                indices.push(ring * ringsize + ((ring2 + 1) % ringsize));

                indices.push(ring * ringsize + ((ring2 + 1) % ringsize));
                indices.push((ring + 1) * ringsize + ring2);
                indices.push((ring + 1) * ringsize + ((ring2 + 1) % ringsize));
            }
        }

        do {
            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);
        } while (colors.length!= vertices.length)

        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;
        const indexBuffer = gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        this.indexBuffer = indexBuffer;
        const normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
        this.normalBuffer = normalBuffer;
        this.elements = indices.length;

        // TODO create colorBuffer [exercise 9]
        // Anlegen des Buffer 
        const colorBuffer = this.gl.createBuffer();
        // Spezifikation des Buffertyps als Vertex / Index Buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Initialiserung des Buffers mit Daten (Vertex Positionen)
        //TODO FIll colorbuffer to fit vertexbuffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.colorBuffer = colorBuffer;
    }

    /**
     * Renders the sphere
     * @param {Shader} shader - The shader used to render
     */
    render(shader: Shader) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = shader.getAttributeLocation("a_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);
        

        // TODO bind colour buffer [exercise 9]
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        var colorLocation = shader.getAttributeLocation("a_color");
        this.gl.enableVertexAttribArray(colorLocation);
        this.gl.vertexAttribPointer(colorLocation, 3, this.gl.FLOAT, false, 0, 0);
        

        // TODO bind normal buffer [exercise 10]
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        var normalLocation = shader.getAttributeLocation("a_normal");
        this.gl.enableVertexAttribArray(normalLocation);
        this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0);




        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disableVertexAttribArray(positionLocation);
        // TODO disable color vertex attrib array [exercise 9]
        this.gl.disableVertexAttribArray(colorLocation);
        // TODO disable normal vertex attrib array [exercise 10]
        this.gl.disableVertexAttribArray(normalLocation);
    }
}