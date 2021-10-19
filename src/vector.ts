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

    this.data = [0, 0, 0, 0]
    this.data[0] = x
    this.data[1] = y
    this.data[2] = z
    this.data[3] = w
  }

  /**
   * Returns the x component of the vector
   * @return The x component of the vector
   */
  get x(): number {
    return this.data[0]
  }

  /**
   * Sets the x component of the vector to val
   * @param val - The new value
   */
  set x(val: number) {
    this.data[0] = val
  }

  /**
   * Returns the first component of the vector
   * @return The first component of the vector
   */
  get r(): number {
    return this.data[0]
  }

  /**
   * Sets the first component of the vector to val
   * @param val The new value
   */
  set r(val: number) {
    this.data[0] = val
  }

  /**
   * Returns the y component of the vector
   * @return The y component of the vector
   */
  get y(): number {
    return this.data[1]
  }

  /**
   * Sets the y component of the vector to val
   * @param val The new value
   */
  set y(val: number) {
    this.data[1] = val
  }

  /**
   * Returns the second component of the vector
   * @return The second component of the vector
   */
  get g(): number {
    return this.data[1]
  }

  /**
   * Sets the second component of the vector to val
   * @param val The new value
   */
  set g(val: number) {
    this.data[1] = val
  }

  /**
   * Returns the z component of the vector
   * @return The z component of the vector
   */
  get z(): number {
    return this.data[2]
  }

  /**
   * Sets the z component of the vector to val
   * @param val The new value
   */
  set z(val: number) {
    this.data[2] = val
  }

  /**
   * Returns the third component of the vector
   * @return The third component of the vector
   */
  get b(): number {
    return this.data[2]
  }

  /**
   * Sets the third component of the vector to val
   * @param val The new value
   */
  set b(val: number) {
    this.data[2] = val
  }

  /**
   * Returns the w component of the vector
   * @return The w component of the vector
   */
  get w(): number {
    return this.data[3]
  }

  /**
   * Sets the w component of the vector to val
   * @param val The new value
   */
  set w(val: number) {
    this.data[3] = val
  }

  /**
   * Returns the fourth component of the vector
   * @return The fourth component of the vector
   */
  get a(): number {
    return this.data[3]
  }

  /**
   * Sets the fourth component of the vector to val
   * @param val The new value
   */
  set a(val: number) {
    this.data[3] = val
  }

  /**
   * Set the value of a specific index in value "data"
   * @param val the new value 
   * @param index the index at which position the new value shall be set
   * @return The new vector;
   */
  setValue(index: number, val: number){
    this.data[index] = val
  }

  /**
   * allows access for the data-instance in the vector class
   * @param index which value in the list shall be returned?
   * @returns the value behind a given index of the stored data-list
   */
  getData(index: number): number{
    return this.data[index]
  }

  getAllData(): [number, number, number, number]{
    return this.data;
  }
  /**
   * Creates a new vector with the vector added
   * @param other The vector to add
   * @return The new vector;
   */
  add(other: Vector): Vector {

    var newVec = new Vector(0,0,0,0);
    for (let i = 0; i < this.data.length; i++){
      newVec.setValue(i, this.getData(i) + other.getData(i))
    }


    return newVec
  }

  /**
   * Creates a new vector with the vector subtracted
   * @param other The vector to subtract
   * @return The new vector
   */
  sub(other: Vector): Vector {
    
    var newVec = new Vector(0,0,0,0);
    for (let i = 0; i < this.data.length; i++){
      newVec.setValue(i, this.getData(i) - other.getData(i))
    } 

    return newVec

  }

  /**
   * Creates a new vector with the scalar multiplied
   * @param other The scalar to multiply
   * @return The new vector
   */
  mul(other: number): Vector {
    
    var newVec = new Vector(0,0,0,0);
    for (let i = 0; i < this.data.length; i++){
      newVec.setValue(i, this.getData(i) * other)
    }


    return newVec
  }

  copy(): Vector{

    return new Vector(this.x, this.y, this.z, this.w);
  }
  
  /**
   * Creates a new vector with the scalar divided
   * @param other The scalar to divide
   * @return The new vector
   */
  div(other: number): Vector {
    var newVec = new Vector(0,0,0,0);
    for (let i = 0; i < this.data.length; i++){
      newVec.setValue(i, this.getData(i) / other)
    }

    return newVec
  }

  /**
   * Dot product
   * @param other The vector to calculate the dot product with
   * @return The result of the dot product
   */
  dot(other: Vector): number {
    var solution = 0;
    for (let i = 0; i < this.data.length; i++){
      solution += this.getData(i) * other.getData(i)
    }

    return solution
  }

  /**
   * Cross product
   * Calculates the cross product using the first three components
   * @param other The vector to calculate the cross product with
   * @return The result of the cross product as new Vector
   */
  cross(other: Vector): Vector {
    

    var solutoinVector = new Vector(0, 0, 0, 0);  	
    
    for (let i = 0; i < this.data.length - 1; i++){
      solutoinVector.setValue(i, this.getData((i + 1) % 3) * other.getData((i + 2) % 3) 
                                - this.getData((i + 2) % 3) * other.getData((i + 1) % 3));
    }

    // set the new vector as a point or a vector ... only depending on the type of "this"
    solutoinVector.setValue(3, 0)

    return solutoinVector
  }

  /**
   * Returns an array representation of the vector
   * @return An array representation.
   */
  valueOf(): [number, number, number, number] {
    return this.data
  }

  /**
   * Normalizes this vector in place
   * @returns this vector for easier function chaining
   */
  normalize(): Vector {
    
    // in case the length is zero 
    if (this.length === 0){
      return this
    }

    var length = this.length
    for (let i = 0; i < this.data.length; i++){
      this.setValue(i, this.getData(i) / length)
    }
    return this
  }

  /**
   * Compares the vector to another
   * @param other The vector to compare to.
   * @return True if the vectors carry equal numbers. The fourth element may be both equivalent to undefined to still return true.
   */
  equals(other: Vector): boolean {
    
    for (let i = 0; i < this.data.length; i++){
      if (this.getData(i) != other.getData(i)){
        return false
      }
    }

    return true

  }

  /**
   * Calculates the length of the vector
   * @return The length of the vector
   */
  get length(): number {
    var length = Math.sqrt(Math.pow(this.getData(0), 2) + Math.pow(this.getData(1), 2) + Math.pow(this.getData(2), 2) + Math.pow(this.getData(3), 2))
    return length
  }
}