attribute vec3 a_position;
// TODO
uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

attribute vec3 color;
attribute vec3 normal;

// varying variables
varying vec3 positionVar;
varying vec3 colorVar;

void main() {
  gl_Position = P*V * M*vec4(a_position, 1.0);
  // TODO
  colorVar = color;

}
