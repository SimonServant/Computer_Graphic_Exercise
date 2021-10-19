import Matrix from "./matrix";
import Vector from "./vector";
import Quaternion from './quaternion';

export interface Transformation {
    getMatrix(): Matrix;
    getInverseMatrix(): Matrix;
}

class MatrixTransformation implements Transformation {
    matrix: Matrix;
    inverse: Matrix;

    constructor(matrix: Matrix, inverse: Matrix) {
        this.matrix = matrix;
        this.inverse = inverse;
    }

    getMatrix(): Matrix {
        return this.matrix;
    }

    getInverseMatrix(): Matrix {
        return this.inverse;
    }
}

export class Translation extends MatrixTransformation {
    constructor(translation: Vector) {
        super(Matrix.translation(translation), Matrix.translation(translation.mul(-1)));
    }
}

export class Rotation extends MatrixTransformation {
    private _axis: Vector;
    private _angle: number;

    constructor(axis: Vector, angle: number) {
        super(Matrix.rotation(axis, angle), Matrix.rotation(axis, -angle));
        this._axis = axis;
        this._angle = angle;
    }

    set axis(axis: Vector) {
        this._axis = axis;
        this.recalculate();
    }

    set angle(angle: number) {
        this._angle = angle;
        this.recalculate();
    }

    private recalculate() {
        this.matrix = Matrix.rotation(this._axis, this._angle);
        this.inverse = Matrix.rotation(this._axis, -this._angle);
    }
}

export class Scaling extends MatrixTransformation {
    constructor(scale: Vector) {
        super(Matrix.scaling(scale), Matrix.scaling(new Vector(1 / scale.x, 1 / scale.y, 1 / scale.z, 0)));
    }
}

export class SQT extends MatrixTransformation {
    scale: Vector;
    quaternion: Quaternion;
    translation: Vector;

    constructor(scale: Vector, rotation: { angle: number, axis: Vector }, translation: Vector) {
        super(Matrix.identity(), Matrix.identity());
        this.scale = scale;
        this.translation = translation;
        this.quaternion = Quaternion.fromAxisAngle(rotation.axis, rotation.angle);
        this.recalculate();
    }

    set rotation(q: Quaternion) {
        this.quaternion = q;
        this.recalculate();
    }

    private recalculate() {
        this.matrix = Matrix.translation(this.translation).mul(this.quaternion.toMatrix()).mul(Matrix.scaling(this.scale));
        this.inverse = Matrix.scaling(new Vector(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z, 0)).mul(this.quaternion.inverse.toMatrix()).mul(Matrix.translation(this.translation.mul(-1)));
    }
}