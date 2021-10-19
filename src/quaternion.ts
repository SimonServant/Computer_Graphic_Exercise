import Matrix from "./matrix";
import Vector from "./vector";

export default class Quaternion {

    data: Vector;

    constructor(x: number, y: number, z: number, w: number) {
        this.data = new Vector(x, y, z, w);
    }

    static fromAxisAngle(axis: Vector, angle: number) {
        let q = new Quaternion(1, 0, 0, 0);

        let qv = axis;
        qv = qv.mul(Math.sin(angle));
    
        // set the data of the Quanternion
        q.data.x = qv.x;
        q.data.y = qv.y;
        q.data.z = qv.z;

        q.data.w = Math.cos(angle);
        

        return q;
    }

    get conjugate(): Quaternion {

        // x * i, y * j, z * k, w
        // x * i + y * j + z * k + w
        let q = new Quaternion(- this.data.x, - this.data.y, - this.data.z, this.data.w);
        return q;
    }

    get inverse(): Quaternion {
        let q = this.conjugate;

        q.data.div(Math.pow(this.norm, 2));
        
        return q;
    }

    get norm(): number {

        return Math.sqrt(   Math.pow(this.data.x, 2) + 
                            Math.pow(this.data.y, 2) +
                            Math.pow(this.data.z, 2) +
                            Math.pow(this.data.w, 2))
    }

    mul(val: number): Quaternion {

        return new Quaternion(this.data.x * val, this.data.y * val, this.data.z * val, this.data.w * val);
    }

    add(other: Quaternion): Quaternion{

        return new Quaternion(  this.data.x + other.data.x, 
                                this.data.y + other.data.y,
                                this.data.z + other.data.z,
                                this.data.w + other.data.w);
    }

    slerp(other: Quaternion, t: number): Quaternion {

        // information about slerp taken from site
        // https://blog.magnum.graphics/backstage/the-unnecessarily-short-ways-to-do-a-quaternion-slerp/

        // INFO: dont simply use "=" as a reference to object "other" will be created
        // Dont do it like this: 
        // let slerpq = other;

        // Also dont do it like this (same problem):
        // let slerpq = new Quaternion(0, 0, 0, 0);
        // slerpq.data = other.data;

        // instead copy the data vector
        let slerpq = new Quaternion(0, 0, 0, 0);
        slerpq.data = other.data.copy();

        
        slerpq = slerpq.mul(t);
        slerpq = slerpq.add(this.mul(1.0 - t));

        // normalize
        slerpq.data = slerpq.data.div(slerpq.norm);

        return slerpq;
    }

    toMatrix(): Matrix {

        var s = 2 / Math.pow(this.norm, 2);

        const x = this.data.x;
        const y = this.data.y;
        const z = this.data.z;
        const w = this.data.w;

        const x2 = Math.pow(x, 2);
        const y2 = Math.pow(y, 2);
        const z2 = Math.pow(z, 2);
    
        let mat = new Matrix([  1 - s * (y2 + z2),      s * (x * y - w * z),    s * (x * z + w * y),    0,
                                s * (x * y + w * z),    1 - s * (x2 + z2),      s * (y * z - w * x),    0,
                                s * (x * z - w * y),    s * (y * z + w * x),    1 - s * (x2 + y2),      0,
                                0,                      0,                      0,                      1])
        return mat;
    }
}