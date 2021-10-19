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

  getRow(row: number): Array<number>{

    return [this.getVal(row, 0), this.getVal(row, 1), this.getVal(row, 2), this.getVal(row, 3) ]
  }

  getCol(col: number): Array<number>{

    return [this.getVal(0, col), this.getVal(1, col), this.getVal(2, col), this.getVal(3, col) ]
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

  mulNumber(factor: number) {
    
    for (let i = 0; i < this.data.length; i++){
      this.data[i] = this.data[i] * factor;
    }
  }

  add(matrix: Matrix){
    for (let i = 0; i < this.data.length; i++){
      this.data[i] = this.data[i] + matrix.data[i];
    }
  }
  
  /**
   * Returns a matrix that represents a translation
   * @param translation The translation vector that shall be expressed by the matrix
   * @return The resulting translation matrix
   */
  static translation(translation: Vector): Matrix {

    return new Matrix([ 1, 0, 0, translation.x, 
                        0, 1, 0, translation.y, 
                        0, 0, 1, translation.z, 
                        0, 0, 0, 1]);
  }

  /**
   * Returns a matrix that represents a rotation. The rotation axis is either the x, y or z axis (either x, y, z is 1).
   * @param axis The axis to rotate around
   * @param angle The angle to rotate
   * @return The resulting rotation matrix
   */
  static rotation(axis: Vector, angle: number): Matrix {

    // contains all rotation matrices
    var rotationMatrizes = [[1, 0, 0, 0,
                            0, Math.cos(angle), -1 * Math.sin(angle), 0,
                            0, Math.sin(angle), Math.cos(angle), 0,
                            0, 0, 0, 1],

                            [Math.cos(angle), 0, Math.sin(angle), 0,
                            0, 1, 0, 0,
                            -1 * Math.sin(angle), 0, Math.cos(angle), 0,
                            0, 0, 0, 1],

                            [Math.cos(angle), -1 * Math.sin(angle), 0, 0,
                            Math.sin(angle), Math.cos(angle), 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1]];

    // iterate over all entries of the axis vector - if one of the indecies is 1, return the 
    // corresponding entry in "rotationMatrizes"
    for (let i = 0; i < rotationMatrizes.length; i++){
      if (i < axis.getAllData().length && axis.getData(i) == 1){

        return new Matrix(rotationMatrizes[i])

      }
    }

    // if there is no index set, return a normal identity matrix
    return Matrix.identity();
  }

  /**
   * Returns a matrix that represents a scaling
   * @param scale The amount to scale in each direction
   * @return The resulting scaling matrix
   */
  static scaling(scale: Vector): Matrix {

    return new Matrix([scale.x, 0, 0, 0, 
                      0, scale.y, 0, 0,
                      0, 0, scale.z, 0,
                      0, 0, 0, 1])
  }

  /**
   * Constructs a lookat matrix
   * @param eye The position of the viewer
   * @param center The position to look at
   * @param up The up direction
   * @return The resulting lookat matrix
   */
  static lookat(eye: Vector, center: Vector, up: Vector): Matrix {

    // the camera has to look at "center"
    // the camera is at position "eye"


    var f  = center.sub(eye).normalize();
    var s = f.cross(up).normalize();
    var u = s.cross(f).normalize();

    var lookat = new Matrix([ s.x,  s.y,   s.z,  0,
                              u.x,  u.y,   u.z,  0,
                              -f.x, -f.y, -f.z, 0,
                              0,    0,    0,    1]).mul(
                                                  new Matrix([1, 0, 0, -eye.x,
                                                              0, 1, 0, -eye.y,
                                                              0, 0, 1, -eye.z,
                                                              0, 0, 0, 1]));
                                              
    return lookat;
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


    // these two transformations are contained in the following matrix

    var A = (right + left) / (right - left);
    var B = (top + bottom) / (top - bottom);
    var C = - (far + near) / (far - near);
    var D = -2 * far * near / (far - near);

    return new Matrix([2 * near / (right - left), 0,                          A,  0,
                      0,                          2 * near / (top - bottom),  B,  0,
                      0,                          0,                          C,  D, 
                      0,                          0,                          -1, 0]);

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


    var top = near * Math.tan(fovy / 360 * Math.PI);
    var bottom = - top;
    var right = top * aspect; 
    var left = - right;

    return this.frustum(left, right, bottom, top, near, far);
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
   * Multiplies each of the elements with each other (elementar) and sums them up
   * @param col A column of matrix or a vector
   * @param row A row of a matrix or a vector
   * @returns a number
   */
  rowTimesCol(col: Array<number>, row: Array<number>): number{

    if (col.length != row.length){
      return null
    }

    var sum = 0
    for (let i = 0; i < col.length; i++){
      sum += col[i] * row[i]
    }

    return sum
  }

  /**
   * Matrix multiplication
   * @param other The matrix to multiplicate with
   * @return The result of the multiplication this*other
   */
  mul(other: Matrix): Matrix {

    // dummy matrix whichs values have to be calculated
    var solution = new Matrix([0, 0, 0, 0,
                              0, 0, 0, 0,
                              0, 0, 0, 0,
                              0, 0, 0, 0]);

    // for each row of the first matrix (this) and each col of the second matrix (other)
    for (let row = 0; row < 4; row++){
      for (let col = 0; col < 4; col++){
        
        // compute the corresponding values
        solution.setVal(row, col, this.rowTimesCol(this.getRow(row), other.getCol(col)))

      }
    }

    return solution
  }

  /**
   * Matrix-vector multiplication
   * @param other The vector to multiplicate with
   * @return The result of the multiplication this*other
   */
  mulVec(other: Vector): Vector {

    // dummy matrix whichs values have to be calculated
    var solution = new Vector(0, 0, 0, 0);

    // for each row of the  matrix (this) and the vector
    for (let row = 0; row < 4; row++){

      // multilpy row times vector
      solution.setValue(row, this.rowTimesCol(this.getRow(row), other.getAllData()))
    }

    return solution
  }

  /**
   * Returns the transpose of this matrix
   * @return A new matrix that is the transposed of this
   */
  transpose(): Matrix {
  // dummy matrix whichs values have to be calculated
  var solution = Matrix.identity();

    // for each row of the first matrix (this) and each col of the second matrix (other)
    for (let row = 0; row < 4; row++){
      for (let col = 0; col < 4; col++){

        // set the value of the column to the value of the row and the other way around
        solution.setVal(col, row, this.getVal(row, col))
      }
    }
    
    return solution
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
}