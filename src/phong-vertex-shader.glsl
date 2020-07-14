attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;
// Pass color as attribute and forward it
// to the fragment shader
// TODO

uniform mat4 M;
uniform mat4 V;
uniform mat4 N; // normal matrix

varying vec3 v_normal;
varying vec3 v_color;
varying vec3 v_position;

// Pass the vertex position in view space
// to the fragment shader
// TODO

void main() {
  gl_Position = V * M * vec4(a_position, 1.0);
  
  // Pass the color and transformed vertex position through
  // TODO
  v_position = a_position;
  // Do we have to transform position somewhat with v and m ? Therefore change it to a_position into
  // a 4 diemsnional vector ? 
  v_normal = (N * vec4(a_normal, 0)).xyz;
  v_color = a_color;
}
