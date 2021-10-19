attribute vec3 a_position;
// TODO
attribute vec3 color;
attribute vec3 normal;

// varying variables
varying vec3 positionVar;
varying vec3 colorVar;

uniform mat4 M;
uniform mat4 V;

void main() {
  gl_Position = M*vec4(a_position, 1.0);
  // TODO
  // assigning the color attribute to the fragment shader 
  colorVar = color;

}
