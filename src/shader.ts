import Matrix from './matrix';
import Vector from './vector';

// Refer to https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/Hinzuf%C3%BCgen_von_2D_Inhalten_in_einen_WebGL-Kontext
/**
 * Class to assemble a Shader to use with WebGL
 */
export default class Shader {
  /**
   * The WebGL program consisting of the
   * vertex shader and the fragment shader
   */
  shaderProgram: WebGLProgram;

  /**
   * Creates a shader
   * @param gl The 3D context
   * @param vertexShaderSource The vertex shader source code
   * @param fragmentShaderSource The fragment shader source code
   */
  constructor(
    private gl: WebGL2RenderingContext,
    private vertexShaderSource: string,
    private fragmentShaderSource: string) {
  }

  load() {
    const gl = this.gl;
    const vertexShader = this.getShader(gl, this.vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = this.getShader(gl, this.fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Create the shader program
    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " +
        gl.getProgramInfoLog(this.shaderProgram));
    }
  }

  /**
   * Use this shader program for the next
   * WebGL calls
   */
  use() {
    this.gl.useProgram(this.shaderProgram);
  }

  /**
   * Returns the attribute location of a variable in the shader program
   * @param  {string} name - The name of the variable
   * @return {number}        The variable's location
   */
  getAttributeLocation(name: string): number {
    const attr = this.gl.getAttribLocation(this.shaderProgram, name);
    if (attr != -1) {
      this.gl.enableVertexAttribArray(attr);
    }
    return attr;
  }

  /**
   * Loads a shader part from its script DOM node and compiles it
   * @param gl The 3D context
   * @param source The source code
   * @return The resulting shader part
   */
  getShader(gl: WebGL2RenderingContext, source: string, type: number): WebGLShader {
    const shader = gl.createShader(type);
    // Send the source to the shader object
    gl.shaderSource(shader, source);
    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  /**
   * Returns an object that can be used to set a matrix on the GPU
   * @param name The name of the uniform to set
   * @return The resulting object
   */
  getUniformMatrix(name: string): UniformMatrix {
    return new UniformMatrix(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    );
  }

  /**
   * Returns an object that can be used to set a vector on the GPU
   * @param name The name of the uniform to set
   * @return The resulting object
   */
  getUniformVec3(name: string): UniformVec3 {
    return new UniformVec3(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    );
  }

  /**
   * Returns an object that can be used to set an int on the GPU
   * @param name The name of the uniform to set
   * @return The resulting object
   */
  getUniformFloat(name: string): UniformFloat {
    return new UniformFloat(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    );
  }

  /**
   * Returns an object that can be used to set an int on the GPU
   * @param name The name of the uniform to set
   * @return The resulting object
   */
  getUniformInt(name: string): UniformInt {
    return new UniformInt(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    );
  }
}

/**
 * Handler class to set uniform matrices
 * in the shader program
 */
class UniformMatrix {
  constructor(
    private gl: WebGL2RenderingContext,
    private position: WebGLUniformLocation
  ) { }

  /**
   * Sends the given matrix to the GPU
   * @param matrix The matrix to send
   */
  set(matrix: Matrix) {
    this.gl.uniformMatrix4fv(
      this.position,
      false,
      matrix.data);
  }
}

/**
 * Handler class to set uniform vectors
 * in the shader program
 */
class UniformVec3 {
  constructor(
    private gl: WebGL2RenderingContext,
    private position: WebGLUniformLocation
  ) { }

  /**
   * Sends the given vector to the GPU as 3dimensional vector
   * @param vec The vector to send
   */
  set(vec: Vector) {
    this.gl.uniform3f(
      this.position, vec.x, vec.y, vec.z
    );
  }
}

/**
 * Handler class to set uniform floats
 * in the shader program
 */
class UniformFloat {
  constructor(
    private gl: WebGL2RenderingContext,
    private position: WebGLUniformLocation
  ) { }

  /**
   * Sends the given float value to the GPU
   * @param value The float value to send
   */
  set(value: number) {
    this.gl.uniform1f(this.position, value);
  }
}

/**
 * Handler class to set uniform ints
 * in the shader program
 */
class UniformInt {
  constructor(
    private gl: WebGL2RenderingContext,
    private position: WebGLUniformLocation
  ) { }

  /**
   * Sends the given int value to the GPU
   * @param value The int value to send
   */
  set(value: number) {
    this.gl.uniform1i(this.position, value);
  }
}