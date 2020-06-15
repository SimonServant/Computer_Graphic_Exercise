import Vector from './vector';

/**
 * Class representing a 4x4 Matrix
 */
export default class Matrix {

  /**
   * Data representing the matrix values
   */
  data: Float32Array;

  /**
   * Constructor of the matrix. Expects an array in row-major layout. Saves the data as column major internally.
   * @param mat Matrix values row major
   */
  constructor(mat: Array<number>) {
    this.data = new Float32Array(16);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.data[row * 4 + col] = mat[col * 4 + row];
      }
    }
  }

  /**
   * Returns the value of the matrix at position row, col
   * @param row The value's row
   * @param col The value's column
   * @return The requested value
   */
  getVal(row: number, col: number): number {
    return this.data[col * 4 + row];
  }

  /**
   * Sets the value of the matrix at position row, col
   * @param row The value's row
   * @param val The value to set to
   * @param col The value's column
   */
  setVal(row: number, col: number, val: number) {
    this.data[col * 4 + row] = val;
  }

  /**
   * Returns a matrix that represents a translation
   * @param translation The translation vector that shall be expressed by the matrix
   * @return The resulting translation matrix
   */
  static translation(translation: Vector): Matrix {
    // TODO exercise 7
    var translationMatrix = Matrix.identity();

    translationMatrix.setVal(0, 3, translation.x)
    translationMatrix.setVal(1, 3, translation.y)
    translationMatrix.setVal(2, 3, translation.z)

    return translationMatrix;
  }

  /**
   * Returns a matrix that represents a rotation. The rotation axis is either the x, y or z axis (either x, y, z is 1).
   * @param axis The axis to rotate around
   * @param angle The angle to rotate
   * @return The resulting rotation matrix
   */
  static rotation(axis: Vector, angle: number): Matrix {
    // TODO exercise 7
    var refactorMatrix = Matrix.identity();

    if (axis.x == 1){

      refactorMatrix.setVal(1, 1, Math.cos(angle));
      refactorMatrix.setVal(1, 2, -Math.sin(angle));
      refactorMatrix.setVal(2, 1, Math.sin(angle));
      refactorMatrix.setVal(2, 2, Math.cos(angle));

    } else if (axis.y == 1){

      refactorMatrix.setVal(0, 0, Math.cos(angle));
      refactorMatrix.setVal(0, 2, Math.sin(angle));
      refactorMatrix.setVal(2, 0, -Math.sin(angle));
      refactorMatrix.setVal(2, 2, Math.cos(angle));

    } else if (axis.z == 1){

      refactorMatrix.setVal(0, 0, Math.cos(angle));
      refactorMatrix.setVal(0, 1, -Math.sin(angle));
      refactorMatrix.setVal(1, 0, Math.sin(angle));
      refactorMatrix.setVal(1, 1, Math.cos(angle));

    } 
    return refactorMatrix;
    }

  /**
   * Returns a matrix that represents a scaling
   * @param scale The amount to scale in each direction
   * @return The resulting scaling matrix
   */
  static scaling(scale: Vector): Matrix {
    // TODO exercise 7
    var scalingMatrix = Matrix.identity();

    scalingMatrix.setVal(0, 0, scale.x)
    scalingMatrix.setVal(1, 1, scale.y)
    scalingMatrix.setVal(2, 2, scale.z)
  
    return scalingMatrix;
  }

  /**
   * Constructs a lookat matrix
   * @param eye The position of the viewer
   * @param center The position to look at
   * @param up The up direction
   * @return The resulting lookat matrix
   */
  static lookat(eye: Vector, center: Vector, up: Vector): Matrix {
    // TODO exercise 10
    return Matrix.identity();
  }

  /**
   * Constructs a new matrix that represents a projection normalisation transformation
   * @param left Camera-space left value of lower near point
   * @param right Camera-space right value of upper right far point
   * @param bottom Camera-space bottom value of lower lower near point
   * @param top Camera-space top value of upper right far point
   * @param near Camera-space near value of lower lower near point
   * @param far Camera-space far value of upper right far point
   * @return The rotation matrix
   */
  static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    // TODO exercise 11
    return Matrix.identity();
  }

  /**
   * Constructs a new matrix that represents a projection normalisation transformation.
   * @param fovy Field of view in y-direction
   * @param aspect Aspect ratio between width and height
   * @param near Camera-space distance to near plane
   * @param far Camera-space distance to far plane
   * @return The resulting matrix
   */
  static perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
    // TODO exercise 11
    return Matrix.identity();
  }

  /**
   * Returns the identity matrix
   * @return A new identity matrix
   */
  static identity(): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * Matrix multiplication
   * @param other The matrix or vector to multiplicate with
   * @return The result of the multiplication this*other
   */
  mul(other: Matrix): Matrix;
  mul(other: Vector): Vector;
  mul(other: Matrix | Vector): Matrix | Vector {
    if (other instanceof Matrix) {
      // TODO exercise 7
      console.log("Matrix-Matrix multiplication");

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          var result = 0;
          for (let num = 0; num < 4; num++){
            result += this.data[row * 4 + num] * other.data[num * 4 + col];
          }
          this.setVal(row, col, result);
        }
      }
      return this
    } else { // other is vector
      // TODO exercise 7
      console.log("Matrix-Vector multiplication");

      var resultVec = new Vector(0, 0, 0, 0);

      for (let row = 0; row < 4; row++) {
        var result = 0;
        for (let num = 0; num < 4; num++){
          result += this.data[row * 4 + num] * other.data[num];
        }
        resultVec.data[row] = result;  
      }
      return resultVec;
    }
  }

  /**
   * Returns the transpose of this matrix
   * @return A new matrix that is the transposed of this
   */
  transpose(): Matrix {
    // TODO exercise 7
    var array = new Array(16);
    for (let num = 0; num < 16; num++){
      array[num] = 0;
    }
    var resultMatrix = new Matrix(array);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        resultMatrix.data[row * 4 + col] = this.data[col * 4 + row];
      }
    }
    return resultMatrix;
  }

  /**
   * Debug print to console
   */
  print() {
    for (let row = 0; row < 4; row++) {
      console.log("> " + this.getVal(row, 0) +
        "\t" + this.getVal(row, 1) +
        "\t" + this.getVal(row, 2) +
        "\t" + this.getVal(row, 3)
      );
    }
  }

  /**
   * Returns a new matrix that is the inverse of this matrix
   * @return The inverse matrix
   */
  invert(): Matrix {
    let mat = this.data;
    let dst = new Float32Array(16); //ret.getValues();
    let tmp = new Float32Array(12);

    /* temparray for pairs */
    let src = new Float32Array(16); //new float[16];

    /* array of transpose source matrix */
    let det;

    /* determinant */
    /*
     * transpose matrix
     */
    for (let i = 0; i < 4; i++) {
      src[i] = mat[i * 4];
      src[i + 4] = mat[i * 4 + 1];
      src[i + 8] = mat[i * 4 + 2];
      src[i + 12] = mat[i * 4 + 3];
    }

    /* calculate pairs for first 8 elements (cofactors) */
    tmp[0] = src[10] * src[15];
    tmp[1] = src[11] * src[14];
    tmp[2] = src[9] * src[15];
    tmp[3] = src[11] * src[13];
    tmp[4] = src[9] * src[14];
    tmp[5] = src[10] * src[13];
    tmp[6] = src[8] * src[15];
    tmp[7] = src[11] * src[12];
    tmp[8] = src[8] * src[14];
    tmp[9] = src[10] * src[12];
    tmp[10] = src[8] * src[13];
    tmp[11] = src[9] * src[12];

    /* calculate first 8 elements (cofactors) */
    dst[0] = tmp[0] * src[5] + tmp[3] * src[6] + tmp[4] * src[7];
    dst[0] -= tmp[1] * src[5] + tmp[2] * src[6] + tmp[5] * src[7];
    dst[1] = tmp[1] * src[4] + tmp[6] * src[6] + tmp[9] * src[7];
    dst[1] -= tmp[0] * src[4] + tmp[7] * src[6] + tmp[8] * src[7];
    dst[2] = tmp[2] * src[4] + tmp[7] * src[5] + tmp[10] * src[7];
    dst[2] -= tmp[3] * src[4] + tmp[6] * src[5] + tmp[11] * src[7];
    dst[3] = tmp[5] * src[4] + tmp[8] * src[5] + tmp[11] * src[6];
    dst[3] -= tmp[4] * src[4] + tmp[9] * src[5] + tmp[10] * src[6];
    dst[4] = tmp[1] * src[1] + tmp[2] * src[2] + tmp[5] * src[3];
    dst[4] -= tmp[0] * src[1] + tmp[3] * src[2] + tmp[4] * src[3];
    dst[5] = tmp[0] * src[0] + tmp[7] * src[2] + tmp[8] * src[3];
    dst[5] -= tmp[1] * src[0] + tmp[6] * src[2] + tmp[9] * src[3];
    dst[6] = tmp[3] * src[0] + tmp[6] * src[1] + tmp[11] * src[3];
    dst[6] -= tmp[2] * src[0] + tmp[7] * src[1] + tmp[10] * src[3];
    dst[7] = tmp[4] * src[0] + tmp[9] * src[1] + tmp[10] * src[2];
    dst[7] -= tmp[5] * src[0] + tmp[8] * src[1] + tmp[11] * src[2];

    /* calculate pairs for second 8 elements (cofactors) */
    tmp[0] = src[2] * src[7];
    tmp[1] = src[3] * src[6];
    tmp[2] = src[1] * src[7];
    tmp[3] = src[3] * src[5];
    tmp[4] = src[1] * src[6];
    tmp[5] = src[2] * src[5];
    tmp[6] = src[0] * src[7];
    tmp[7] = src[3] * src[4];
    tmp[8] = src[0] * src[6];
    tmp[9] = src[2] * src[4];
    tmp[10] = src[0] * src[5];
    tmp[11] = src[1] * src[4];

    /* calculate second 8 elements (cofactors) */
    dst[8] = tmp[0] * src[13] + tmp[3] * src[14] + tmp[4] * src[15];
    dst[8] -= tmp[1] * src[13] + tmp[2] * src[14] + tmp[5] * src[15];
    dst[9] = tmp[1] * src[12] + tmp[6] * src[14] + tmp[9] * src[15];
    dst[9] -= tmp[0] * src[12] + tmp[7] * src[14] + tmp[8] * src[15];
    dst[10] = tmp[2] * src[12] + tmp[7] * src[13] + tmp[10] * src[15];
    dst[10] -= tmp[3] * src[12] + tmp[6] * src[13] + tmp[11] * src[15];
    dst[11] = tmp[5] * src[12] + tmp[8] * src[13] + tmp[11] * src[14];
    dst[11] -= tmp[4] * src[12] + tmp[9] * src[13] + tmp[10] * src[14];
    dst[12] = tmp[2] * src[10] + tmp[5] * src[11] + tmp[1] * src[9];
    dst[12] -= tmp[4] * src[11] + tmp[0] * src[9] + tmp[3] * src[10];
    dst[13] = tmp[8] * src[11] + tmp[0] * src[8] + tmp[7] * src[10];
    dst[13] -= tmp[6] * src[10] + tmp[9] * src[11] + tmp[1] * src[8];
    dst[14] = tmp[6] * src[9] + tmp[11] * src[11] + tmp[3] * src[8];
    dst[14] -= tmp[10] * src[11] + tmp[2] * src[8] + tmp[7] * src[9];
    dst[15] = tmp[10] * src[10] + tmp[4] * src[8] + tmp[9] * src[9];
    dst[15] -= tmp[8] * src[9] + tmp[11] * src[10] + tmp[5] * src[8];

    /* calculate determinant */
    det = src[0] * dst[0] + src[1] * dst[1] + src[2] * dst[2] + src[3] * dst[3];

    if (det == 0.0) {
      throw new Error("singular matrix is not invertible");
    }

    /* calculate matrix inverse */
    det = 1 / det;

    for (let j = 0; j < 16; j++) {
      dst[j] *= det;
    }

    let ret = Matrix.identity();
    ret.data = dst;
    return ret;
  }
}