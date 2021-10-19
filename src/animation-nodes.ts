/**
 * Author: Fabian Sieper
 */
import Vector from './vector';
import { GroupNode } from './nodes';
import { Rotation, SQT } from './transformation';
import Quaternion from './quaternion';

/**
 * Class representing an Animation
 */
class AnimationNode {
  /**
   * Describes if the animation is running
   */
  active: boolean;

  /**
   * Creates a new AnimationNode
   * @param groupNode The GroupNode to attach to
   */
  constructor(public groupNode: GroupNode) {
    this.active = true;
  }

  /**
   * Toggles the active state of the animation node
   */
  toggleActive() {
    this.active = !this.active;
  }

}

/**
 * Class representing a Rotation Animation
 * @extends AnimationNode
 */
export class RotationNode extends AnimationNode {
  /**
   * The absolute angle of the rotation
   */
  angle: number;
  /**
   * The vector to rotate around
   */
  axis: Vector;

  /**
   * Creates a new RotationNode
   * @param groupNode The group node to attach to
   * @param axis The axis to rotate around
   */
  constructor(groupNode: GroupNode, axis: Vector) {
    super(groupNode);
    this.angle = 0;
    this.axis = axis;
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {
    // change the matrix of the attached
    // group node to reflect a rotation
    // TODO

    // if the animation is active
    if (this.active){

      // compute the rotation matrix
      var deltaAngle = 0.001;
      this.angle += deltaAngle * deltaT;

      
      this.groupNode.transform = new Rotation(this.axis, this.angle);


      // DEBUGGING NOTES FOR CRAZY MOVING TEXTURE BLOCK

      // The Following points should not be the problem:
      // - not because of rotation matrices
      // - change of Rotation seems to be right (Melina has the same)
      // - tree multiplication of matrices is not the problem ... always worked so far

      // might the problem be the P or the V Matrix from visitTextureBoxNode?
      // ... dont think so as they only depend on the camera, which doesent change per frame
      // ... also the formulas seem to be correct

      // thus, the vertices of the box arent set correctly ... (follows wrong matrices in shader)

      

      // Possible error finding: Insert const value in functoin "simulare" in "animation-boilerplate.ts" and compare
      // values of Matrices to correct solution
      
    }
  }

}

/**
 * Class representing a Rotation Animation
 * @extends AnimationNode
 */
export class SlerpNode extends AnimationNode {
  /**
   * The time
   */
  t: number;

  /**
   * The rotations to interpolate between
   */
  rotations: [Quaternion, Quaternion];

  /**
   * Creates a new RotationNode
   * @param groupNode The group node to attach to
   * @param axis The axis to rotate around
   */
  constructor(groupNode: GroupNode, rotation1: Quaternion, rotation2: Quaternion) {
    super(groupNode);
    this.rotations = [rotation1, rotation2];
    this.t = 0;
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {
    if (this.active) {
      this.t += 0.001 * deltaT;
      const rot = this.rotations[0].slerp(this.rotations[1], (Math.sin(this.t) + 1) / 2);
      (this.groupNode.transform as SQT).rotation = rot;
    }
  }

}