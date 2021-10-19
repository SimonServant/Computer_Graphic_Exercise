precision mediump float;

attribute vec3 a_position;
attribute vec3 a_normal;

// Pass color as attribute and forward it
// to the fragment shader
// TODO

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N; // normal matrix

varying vec3 v_normal;

// Pass the vertex position in view space
// to the fragment shader
// TODO
varying vec3 colorVar;
varying vec3 positionVar;

void main() {
  gl_Position = P * V * M * vec4(a_position, 1.0);

  // Pass the color and transformed vertex position through
  // TODO
  positionVar = vec3(V * M * vec4(a_position, 1.0));
  colorVar =  vec3(1., 0.5, 0);

  v_normal = normalize((V * N * vec4(a_normal, 0)).xyz);
}
