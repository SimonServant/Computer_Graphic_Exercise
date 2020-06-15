/**
 * Class representing a vector in 4D space
 */
export default class Vector {
  /**
   * The variable to hold the vector data
   */
  data: [number, number, number, number];

  /**
   * Create a vector
   * @param x The x component
   * @param y The y component
   * @param z The z component
   * @param w The w component
   */
  constructor(x: number, y: number, z: number, w: number) {
    this.data = [x, y, z, w];
  }

  /**
   * Returns the x component of the vector
   * @return The x component of the vector
   */
  get x(): number {
    return this.data[0];
  }

  /**
   * Sets the x component of the vector to val
   * @param val - The new value
   */
  set x(val: number) {
    this.data[0] = val;
  }

  /**
   * Returns the first component of the vector
   * @return The first component of the vector
   */
  get r(): number {
    return this.data[0];
  }

  /**
   * Sets the first component of the vector to val
   * @param val The new value
   */
  set r(val: number) {
    this.data[0] = val;
  }

  /**
   * Returns the y component of the vector
   * @return The y component of the vector
   */
  get y(): number {
    return this.data[1];
  }

  /**
   * Sets the y component of the vector to val
   * @param val The new value
   */
  set y(val: number) {
    this.data[1] = val;
  }

  /**
   * Returns the second component of the vector
   * @return The second component of the vector
   */
  get g(): number {
    return this.data[1];
  }

  /**
   * Sets the second component of the vector to val
   * @param val The new value
   */
  set g(val: number) {
    this.data[1] = val;
  }

  /**
   * Returns the z component of the vector
   * @return The z component of the vector
   */
  get z(): number {
    return this.data[2];
  }

  /**
   * Sets the z component of the vector to val
   * @param val The new value
   */
  set z(val: number) {
    this.data[2] = val;
  }

  /**
   * Returns the third component of the vector
   * @return The third component of the vector
   */
  get b(): number {
    return this.data[2];
  }

  /**
   * Sets the third component of the vector to val
   * @param val The new value
   */
  set b(val: number) {
    this.data[2] = val;
  }

  /**
   * Returns the w component of the vector
   * @return The w component of the vector
   */
  get w(): number {
    return this.data[3];
  }

  /**
   * Sets the w component of the vector to val
   * @param val The new value
   */
  set w(val: number) {
    this.data[3] = val;
  }

  /**
   * Returns the fourth component of the vector
   * @return The fourth component of the vector
   */
  get a(): number {
    return this.data[3];
  }

  /**
   * Sets the fourth component of the vector to val
   * @param val The new value
   */
  set a(val: number) {
    this.data[3] = val;
  }

  /**
   * Creates a new vector with the vector added
   * @param other The vector to add
   * @return The new vector;
   */
  add(other: Vector): Vector {
    var firstValue = this.data[0] + other.data[0];
    var secondValue = this.data[1] + other.data[1];
    var thirdValue = this.data[2] + other.data[2];
    var fourthValue = this.data[3] + other.data[3];
    return new Vector(firstValue, secondValue, thirdValue, fourthValue);
  }

  /**
   * Creates a new vector with the vector subtracted
   * @param other The vector to subtract
   * @return The new vector
   */
  sub(other: Vector): Vector {
    var firstValue = this.data[0] - other.data[0];
    var secondValue = this.data[1] - other.data[1];
    var thirdValue = this.data[2] - other.data[2];
    var fourthValue = this.data[3] - other.data[3];
    return new Vector(firstValue, secondValue, thirdValue, fourthValue);
  }

  /**
   * Creates a new vector with the scalar multiplied
   * @param other The scalar to multiply
   * @return The new vector
   */
  mul(other: number): Vector {
    var firstValue = this.data[0] * other;
    var secondValue = this.data[1] * other;
    var thirdValue = this.data[2] * other;
    var fourthValue = this.data[3] * other;
    return new Vector(firstValue, secondValue, thirdValue, fourthValue);
  }

  /**
   * Creates a new vector with the scalar divided
   * @param other The scalar to divide
   * @return The new vector
   */
  div(other: number): Vector {
    var firstValue = this.data[0] / other;
    var secondValue = this.data[1] / other;
    var thirdValue = this.data[2] / other;
    var fourthValue = this.data[3] / other;
    return new Vector(firstValue, secondValue, thirdValue, fourthValue);
  }

  /**
   * Dot product
   * @param other The vector to calculate the dot product with
   * @return The result of the dot product
   */
  dot(other: Vector): number {
    var firstValue = this.data[0] * other.data[0];
    var secondValue = this.data[1] * other.data[1];
    var thirdValue = this.data[2] * other.data[2];
    var fourthValue = this.data[3] * other.data[3];
    return firstValue + secondValue + thirdValue + fourthValue;
  }

  /**
   * Cross product
   * Calculates the cross product using the first three components
   * @param other The vector to calculate the cross product with
   * @return The result of the cross product as new Vector
   */
  cross(other: Vector): Vector {
    var firstValue = this.data[1] * other.data[2] - this.data[2] * other.data[1];
    var secondValue = this.data[2] * other.data[0] - this.data[0] * other.data[2];;
    var thirdValue = this.data[0] * other.data[1] - this.data[1] * other.data[0];;
    var fourthValue = 0; // No cross product for 4 dimensional vectors
    return new Vector(firstValue, secondValue, thirdValue, fourthValue);
  }

  /**
   * Returns an array representation of the vector
   * @return An array representation.
   */
  valueOf(): [number, number, number, number] {
    return this.data;
  }

  /**
   * Creates a new vector by normalising the vector
   * @return A vector with length 1
   */
  normalised(): Vector {
    var firstValue = this.data[0] / this.length;
    var secondValue = this.data[1] / this.length;
    var thirdValue = this.data[2] / this.length;
    var fourthValue = this.data[3] / this.length;
    return new Vector(firstValue, secondValue, thirdValue, fourthValue);
  }

  /**
   * Compares the vector to another
   * @param other The vector to compare to.
   * @return True if the vectors carry equal numbers. The fourth element may be both equivalent to undefined to still return true.
   */
  equals(other: Vector): boolean {
    var firstValue = this.data[0] === other.data[0];
    var secondValue = this.data[1] === other.data[1];
    var thirdValue = this.data[2] === other.data[2];
    var fourthValue = this.data[3] === other.data[3];
    return firstValue && secondValue && thirdValue && fourthValue;
  }

  /**
   * Calculates the length of the vector
   * @return The length of the vector
   */
  get length(): number {
    var firstValue = this.data[0] * this.data[0];
    var secondValue = this.data[1] * this.data[1];
    var thirdValue = this.data[2] * this.data[2];
    var fourthValue = this.data[3] * this.data[3];
    var length = Math.sqrt(firstValue + secondValue + thirdValue + fourthValue);
    return length;
  }

  /**
   * Debug print to console
   */
  print() {
    for (let row = 0; row < 4; row++) {
      console.log("> " + this.x +
        "\t" + this.y +
        "\t" + this.z +
        "\t" + this.w 
      );
    }
  }
}
